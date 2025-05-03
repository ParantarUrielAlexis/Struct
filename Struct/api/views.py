from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer
from .models import Class, UserLog
from .serializers import ClassSerializer, ClassCreateSerializer, UserLogSerializer

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "success": True,
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Please provide both email and password'},
                            status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, email=email, password=password)

        if not user:
            return Response({'error': 'Invalid credentials'},
                            status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type
        }, status=status.HTTP_200_OK)

class ClassCreateView(generics.CreateAPIView):
    serializer_class = ClassCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class JoinClassView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')

        if not code:
            return Response({"error": "Class code is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            class_obj = Class.objects.get(code=code)

            # If user is already enrolled or is the teacher
            if request.user in class_obj.students.all() or class_obj.teacher == request.user:
                return Response({
                    "success": True,
                    "message": "You are already enrolled in this class",
                    "class": ClassSerializer(class_obj).data
                })

            # Add user to the class
            class_obj.students.add(request.user)

            return Response({
                "success": True,
                "message": "Successfully joined the class",
                "class": ClassSerializer(class_obj).data
            })

        except Class.DoesNotExist:
            return Response({"error": "Invalid class code"}, status=status.HTTP_404_NOT_FOUND)

class UserClassesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_classes = {}

        # Get classes where user is a student
        enrolled_classes = user.enrolled_classes.all()

        # Get classes where user is a teacher
        teaching_classes = user.teaching_classes.all()

        return Response({
            "enrolled_classes": ClassSerializer(enrolled_classes, many=True).data,
            "teaching_classes": ClassSerializer(teaching_classes, many=True).data,
            "user_type": user.user_type  # Assuming user_type is available
        })

class UserLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = UserLog.objects.all()
        serializer = UserLogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)