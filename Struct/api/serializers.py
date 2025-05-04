from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Class, UserLog, UserProgress

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'user_type')
        extra_kwargs = {
            'user_type': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=validated_data['user_type']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

class ClassSerializer(serializers.ModelSerializer):
    students_count = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ['id', 'name', 'description', 'code', 'created_at', 'students_count']
        read_only_fields = ['code']

    def get_students_count(self, obj):
        return obj.students.count()

class ClassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'description', 'code']
        read_only_fields = ['code']

    def create(self, validated_data):
        # Set the current user as the teacher
        user = self.context['request'].user
        validated_data['teacher'] = user
        return super().create(validated_data)
    
class UserLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLog
        fields = ['username','game_name', 'date_time', 'duration', 'score', 'remarks', 'attempts']

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['selection_sort_passed', 'bubble_sort_passed', 'insertion_sort_passed']