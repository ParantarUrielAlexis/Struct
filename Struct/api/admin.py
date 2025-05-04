from django.contrib import admin
from .models import User, Class, UserLog, UserProgress
# Register your models here.
admin.site.register(User)
admin.site.register(Class)
admin.site.register(UserLog)
admin.site.register(UserProgress)