from rest_framework import serializers
from .models import (
    Project,
    ZarorratService,
    ZarorratProject,
    ZarorratProjectService,
    UniqueSolarProduct,
    UniqueSolarProject,
    UniqueSolarProjectProduct,
    UniqueSolarProjectImage,
    UniqueSolarProjectChecklist
)

class ZarorratServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZarorratService
        fields = '__all__'

class ZarorratProjectServiceSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = ZarorratProjectService
        fields = ['id', 'service', 'service_name', 'created_at']

class ZarorratProjectSerializer(serializers.ModelSerializer):
    selected_services = ZarorratProjectServiceSerializer(many=True, read_only=True)
    service_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    company_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ZarorratProject
        fields = '__all__'
        read_only_fields = ['project_id', 'created_at', 'updated_at']
    
    def get_company_name(self, obj):
        """Return company name based on project ID"""
        if obj.project_id and obj.project_id.startswith('ZR-'):
            return 'ZROORAT.COM'
        return None
    
    def create(self, validated_data):
        service_ids = validated_data.pop('service_ids', [])
        project = ZarorratProject.objects.create(**validated_data)
        
        # Create service relationships
        for service_id in service_ids:
            try:
                service = ZarorratService.objects.get(id=service_id)
                ZarorratProjectService.objects.create(project=project, service=service)
            except ZarorratService.DoesNotExist:
                pass
        
        return project
    
    def update(self, instance, validated_data):
        service_ids = validated_data.pop('service_ids', None)
        
        # Update project fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update services if provided
        if service_ids is not None:
            # Remove existing services
            instance.selected_services.all().delete()
            
            # Add new services
            for service_id in service_ids:
                try:
                    service = ZarorratService.objects.get(id=service_id)
                    ZarorratProjectService.objects.create(project=instance, service=service)
                except ZarorratService.DoesNotExist:
                    pass
        
        return instance

class UniqueSolarProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarProduct
        fields = '__all__'

class UniqueSolarProjectProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarProjectProduct
        fields = '__all__'
        read_only_fields = ['line_total', 'created_at']

class UniqueSolarProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarProjectImage
        fields = '__all__'
        read_only_fields = ['created_at']

class UniqueSolarProjectChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarProjectChecklist
        fields = '__all__'
        read_only_fields = ['created_at']

class UniqueSolarProjectSerializer(serializers.ModelSerializer):
    products = UniqueSolarProjectProductSerializer(many=True, read_only=True)
    images = UniqueSolarProjectImageSerializer(many=True, read_only=True)
    checklist_items = UniqueSolarProjectChecklistSerializer(many=True, read_only=True)
    
    class Meta:
        model = UniqueSolarProject
        fields = '__all__'
        read_only_fields = [
            'project_id', 'subtotal', 'grand_total', 'total_payment', 
            'completion_payment', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        project = UniqueSolarProject.objects.create(**validated_data)
        # Force save to ensure primary key is generated
        project.save()
        return project
    
    def to_representation(self, instance):
        """Custom representation to handle related fields properly"""
        data = super().to_representation(instance)
        # Ensure related fields are properly serialized
        if hasattr(instance, 'products'):
            data['products'] = UniqueSolarProjectProductSerializer(instance.products.all(), many=True).data
        if hasattr(instance, 'images'):
            data['images'] = UniqueSolarProjectImageSerializer(instance.images.all(), many=True).data
        if hasattr(instance, 'checklist_items'):
            data['checklist_items'] = UniqueSolarProjectChecklistSerializer(instance.checklist_items.all(), many=True).data
        return data
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# Legacy Project serializer for backward compatibility
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['project_id', 'pending', 'created_at', 'updated_at'] 