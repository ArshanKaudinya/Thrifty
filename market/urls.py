from django.urls import path
from .views import FilteredProductListView
from .views import price_range

urlpatterns = [
    path('products/', FilteredProductListView.as_view(), name='product-list'),
    path('products/price-range/', price_range, name='price-range'),
]