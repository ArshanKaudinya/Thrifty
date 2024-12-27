from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Product ,CustomUser, UserProfile


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')  # Customize columns in the admin

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('id', 'email', 'name')
    list_filter = ('id', 'email', 'name')
    ordering = ('email',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'name', 'college', 'city', 'date_joined')
    search_fields = ('email', 'name', 'college', 'city')
    ordering = ('date_joined',)