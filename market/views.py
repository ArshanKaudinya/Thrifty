from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Min, Max
from .models import Product, CustomUser, UserProfile
from .serializers import ProductSerializer, CustomUserSerializer, UserProfileSerializer
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
    
class UploadProductView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):

    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User profile created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            profile = UserProfile.objects.filter(id=id).first()
            if not profile:
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id):
        profile = UserProfile.objects.filter(id=id).first()
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        avatar = request.data.get('avatar')
        if avatar:
            profile.avatar = avatar
            profile.save()

        return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
    
    def delete(self, request, id):
        profile = UserProfile.objects.filter(id=id).first()
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        profile.delete()
        return Response({'message': 'Profile deleted successfully'}, status=status.HTTP_200_OK)
    
def productdetails(request, id):
    product = get_object_or_404(Product, id=id)
    return JsonResponse({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': float(product.price),  # Convert Decimal to float
        'category': product.category,
        'condition': product.condition,
        'image': product.image.url if product.image else None,
        'created_at': product.created_at,
    })

        
class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class FilteredProductListView(ListCreateAPIView):
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = Product.objects.all()
       
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        condition = self.request.query_params.get('condition')
        if condition:
            queryset = queryset.filter(condition=condition)
      
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price and max_price:
            queryset = queryset.filter(price__gte=min_price, price__lte=max_price)
        return queryset


@api_view(['GET'])
def price_range(request):
    min_price = Product.objects.aggregate(Min('price'))['price__min'] or 0
    max_price = Product.objects.aggregate(Max('price'))['price__max'] or 0
    return Response({'min': min_price, 'max': max_price})
