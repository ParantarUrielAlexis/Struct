from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
import random
import string

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')

    USERNAME_FIELD = 'email'  # Use email as the primary identifier for login
    REQUIRED_FIELDS = ['username', 'user_type']  # Ensure these fields are required for creation

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email  # Optional: or use 'username' if you prefer to show the username

def generate_class_code():
    """Generate a random 6-character alphanumeric class code"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(6))

class Class(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    code = models.CharField(max_length=10, unique=True, default=generate_class_code)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teaching_classes')
    students = models.ManyToManyField(User, related_name='enrolled_classes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"
    
class UserLog(models.Model):
    username = models.CharField(max_length=150)
    date_time = models.DateTimeField()
    duration = models.CharField(max_length=20)
    score = models.FloatField()
    remarks = models.CharField(max_length=100)
    attempts = models.IntegerField()