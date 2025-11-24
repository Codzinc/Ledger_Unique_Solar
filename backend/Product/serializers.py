from rest_framework import serializers
from .models import Product, ProductImage
from django.db import models

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    total_purchase_cost = serializers.ReadOnlyField()
    total_sale_value = serializers.ReadOnlyField()
    profit_per_unit = serializers.ReadOnlyField()
    total_profit = serializers.ReadOnlyField()
    profit_margin_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'customer_name', 'date', 'purchase_price', 
            'sale_price', 'category', 'quantity', 'description',
            'created_at', 'updated_at', 'images',
            'total_purchase_cost', 'total_sale_value', 'profit_per_unit',
            'total_profit', 'profit_margin_percentage'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ProductCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True
    )
    image = serializers.ImageField(required=False, write_only=True)  # For single image upload

    class Meta:
        model = Product
        fields = [
            'name', 'brand', 'customer_name', 'date', 'purchase_price', 
            'sale_price', 'category', 'quantity', 'description', 'images', 'image'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        single_image = validated_data.pop('image', None)
        product = Product.objects.create(**validated_data)
        
        if single_image:
            # Create ProductImage object for single uploaded image
            ProductImage.objects.create(
                product=product,
                image=single_image,
                order=1
            )
        elif images_data:
            # Create ProductImage objects for uploaded images
            for index, image_data in enumerate(images_data[:7]):  # Limit to 7 images
                ProductImage.objects.create(
                    product=product,
                    image=image_data,
                    order=index + 1
                )
        
        return product

class ProductUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True
    )
    image = serializers.ImageField(required=False, write_only=True)  # For single image upload
    remove_images = serializers.BooleanField(required=False, write_only=True)

    class Meta:
        model = Product
        fields = [
            'name', 'brand', 'customer_name', 'date', 'purchase_price', 
            'sale_price', 'category', 'quantity', 'description', 'images', 'image', 'remove_images'
        ]

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        single_image = validated_data.pop('image', None)
        remove_images = validated_data.pop('remove_images', False)
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle image updates
        if remove_images:
            # Remove all existing images
            ProductImage.objects.filter(product=instance).delete()
        elif single_image:
            # Add the single uploaded image to existing images
            existing_count = ProductImage.objects.filter(product=instance).count()
            if existing_count < 7:  # Check if we haven't reached the limit
                # Get the next available order number
                max_order = ProductImage.objects.filter(product=instance).aggregate(
                    max_order=models.Max('order')
                )['max_order'] or 0
                next_order = max_order + 1
                
                ProductImage.objects.create(
                    product=instance,
                    image=single_image,
                    order=next_order
                )
        elif images_data:
            # Add new images to existing images
            existing_count = ProductImage.objects.filter(product=instance).count()
            available_slots = 7 - existing_count
            
            if available_slots > 0:
                # Get the next available order number
                max_order = ProductImage.objects.filter(product=instance).aggregate(
                    max_order=models.Max('order')
                )['max_order'] or 0
                
                for index, image_data in enumerate(images_data[:available_slots]):
                    ProductImage.objects.create(
                        product=instance,
                        image=image_data,
                        order=max_order + index + 1
                    )
        
        return instance 