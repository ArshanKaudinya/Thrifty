from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Product ,CustomUser


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')  # Customize columns in the admin

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('id', 'email', 'name', 'mobile_number', 'college', 'city', 'date_joined')
    search_fields = ('email', 'name', 'mobile_number', 'college', 'city')
    ordering = ('id',)
    list_filter = ()

    fieldsets = (
        (None, {'fields': ('id', 'email', 'password')}),
        ('Personal Info', {'fields': ('name', 'mobile_number', 'college', 'city')}),
        ('Important Dates', {'fields': ('date_joined', 'last_login')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'name', 'mobile_number', 'college', 'city'),
        }),
    )