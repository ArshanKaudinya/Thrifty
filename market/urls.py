from django.urls import path
from .views import FilteredProductListView
from .views import price_range
from .views import productdetails
from .views import UserProfileView
from .views import UploadProductView

urlpatterns = [
    path('products/', FilteredProductListView.as_view(), name='product-list'),
    path('products/price-range/', price_range, name='price-range'),
    path('products/<int:id>/', productdetails, name='productdetails'),
    path('userprofiles/', UserProfileView.as_view(), name='userprofile-list'),
    path('userprofiles/<str:id>/', UserProfileView.as_view(), name='userprofile-detail'),
    path('products/', UploadProductView.as_view(), name='upload-product'),
]
