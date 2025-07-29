from rest_framework import serializers
from .models import (
    ZarorratService,
    ZarorratProject,
    ZarorratProjectService,
    UniqueSolarProject,
    UniqueSolarProjectImage,
    UniqueSolarChecklist,
    UniqueSolarProjectProduct,
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






class UniqueSolarChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarChecklist
        fields = '__all__'
        read_only_fields = ['created_at']


class UniqueSolarProjectChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarProjectChecklist
        fields = '__all__'
        read_only_fields = ['created_at']

class UniqueSolarProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarProjectImage
        fields = '__all__'
        read_only_fields = ['created_at']
    
    def validate(self, data):
        """Validate that the project doesn't exceed 7 images"""
        project = data.get('project')
        if project:
            existing_count = UniqueSolarProjectImage.objects.filter(project=project).count()
            if existing_count >= 7:
                raise serializers.ValidationError("Maximum of 7 images allowed per project")
        return data

class UniqueSolarProjectProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueSolarProjectProduct
        fields = '__all__'
        read_only_fields = ['created_at']

class UniqueSolarProjectSerializer(serializers.ModelSerializer):
    images = UniqueSolarProjectImageSerializer(many=True, read_only=True)
    products = UniqueSolarProjectProductSerializer(many=True, read_only=True)
    checklist_items = UniqueSolarProjectChecklistSerializer(many=True, read_only=True)
    image_count = serializers.SerializerMethodField()

    class Meta:
        model = UniqueSolarProject
        fields = '__all__'
    
    def get_image_count(self, obj):
        """Return the number of images for this project"""
        return obj.images.count()


