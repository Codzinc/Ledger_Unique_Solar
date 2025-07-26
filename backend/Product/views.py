from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductCreateSerializer, ProductUpdateSerializer

class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CreateProductView(APIView):
    """
    Create a new product with images
    Requires authentication with access token
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def post(self, request):
        serializer = ProductCreateSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            response_serializer = ProductSerializer(product)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListProductsView(APIView):
    """
    List all products for the authenticated user with pagination
    Requires authentication with access token
    """
    permission_classes = [IsAuthenticated]
    pagination_class = ProductPagination
    
    def get(self, request):
        products = Product.objects.all()
        
        paginator = self.pagination_class()
        paginated_products = paginator.paginate_queryset(products, request)
        
        serializer = ProductSerializer(paginated_products, many=True)
        return paginator.get_paginated_response(serializer.data)

class RetrieveProductView(APIView):
    """
    Retrieve a single product by ID
    Requires authentication with access token
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateProductView(APIView):
    """
    Update an existing product by ID
    Requires authentication with access token
    Supports updating all product fields including images
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def put(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        serializer = ProductUpdateSerializer(product, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_product = serializer.save()
            response_serializer = ProductSerializer(updated_product)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, product_id):
        """Partial update - same as PUT for this implementation"""
        return self.put(request, product_id)

class DeleteProductView(APIView):
    """
    Delete a product by ID
    Requires authentication with access token
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        product.delete()
        return Response(
            {"message": "Product deleted successfully"}, 
            status=status.HTTP_204_NO_CONTENT
        )

class DeleteProductImageView(APIView):
    """
    Delete a specific image from a product
    Requires authentication with access token
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, product_id, image_id):
        product = get_object_or_404(Product, id=product_id)
        
        try:
            product_image = ProductImage.objects.get(id=image_id, product=product)
        except ProductImage.DoesNotExist:
            return Response(
                {"error": "Image not found or does not belong to this product"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        product_image.delete()
        
        return Response(
            {"message": "Image deleted successfully"}, 
            status=status.HTTP_200_OK
        )
