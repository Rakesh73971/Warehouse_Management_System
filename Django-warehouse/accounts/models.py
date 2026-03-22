from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.utils import timezone

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self,email,full_name,password=None,role='STAFF'):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            full_name=full_name,
            role=role
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,full_name,password):
        user = self.create_user(
            email=email,
            full_name=full_name,
            password=password,
            role='ADMIN'
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser,PermissionsMixin):
    ROLE_CHOICES = (
        ("ADMIN",'admin'),
        ('MANAGER','manager'),
        ('STAFF','staff')
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=255,choices=ROLE_CHOICES,default='STAFF')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email