from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
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
from .serializers import (
    ProjectSerializer,
    ZarorratServiceSerializer,
    ZarorratProjectSerializer,
    ZarorratProjectServiceSerializer,
    UniqueSolarProductSerializer,
    UniqueSolarProjectSerializer,
    UniqueSolarProjectProductSerializer,
    UniqueSolarProjectImageSerializer,
    UniqueSolarProjectChecklistSerializer
)

# Legacy Project views
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

# Zarorrat Service views
class ZarorratServiceViewSet(viewsets.ModelViewSet):
    queryset = ZarorratService.objects.filter(is_active=True)
    serializer_class = ZarorratServiceSerializer
    
    def get_queryset(self):
        queryset = ZarorratService.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset

# Zarorrat Project views
class ZarorratProjectViewSet(viewsets.ModelViewSet):
    queryset = ZarorratProject.objects.all()
    serializer_class = ZarorratProjectSerializer
    
    def get_queryset(self):
        queryset = ZarorratProject.objects.all()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
    
    @action(detail=True, methods=['get'])
    def services(self, request, pk=None):
        project = self.get_object()
        services = project.selected_services.all()
        serializer = ZarorratProjectServiceSerializer(services, many=True)
        return Response(serializer.data)

# Unique Solar Product views
class UniqueSolarProductViewSet(viewsets.ModelViewSet):
    queryset = UniqueSolarProduct.objects.filter(is_active=True)
    serializer_class = UniqueSolarProductSerializer
    
    def get_queryset(self):
        queryset = UniqueSolarProduct.objects.all()
        product_type = self.request.query_params.get('product_type', None)
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        return queryset

# Unique Solar Project views
class UniqueSolarProjectViewSet(viewsets.ModelViewSet):
    queryset = UniqueSolarProject.objects.all()
    serializer_class = UniqueSolarProjectSerializer
    
    def get_queryset(self):
        queryset = UniqueSolarProject.objects.all()
        status_filter = self.request.query_params.get('status', None)
        installation_type = self.request.query_params.get('installation_type', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if installation_type:
            queryset = queryset.filter(installation_type=installation_type)
        
        return queryset
    
    @action(detail=True, methods=['get', 'post'])
    def products(self, request, pk=None):
        project = self.get_object()
        
        if request.method == 'GET':
            products = project.products.all()
            serializer = UniqueSolarProjectProductSerializer(products, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = UniqueSolarProjectProductSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(project=project)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get', 'post'])
    def images(self, request, pk=None):
        project = self.get_object()
        
        if request.method == 'GET':
            images = project.images.all()
            serializer = UniqueSolarProjectImageSerializer(images, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = UniqueSolarProjectImageSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(project=project)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get', 'post'])
    def checklist(self, request, pk=None):
        project = self.get_object()
        
        if request.method == 'GET':
            checklist_items = project.checklist_items.all()
            serializer = UniqueSolarProjectChecklistSerializer(checklist_items, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = UniqueSolarProjectChecklistSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(project=project)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Unique Solar Project Product views
class UniqueSolarProjectProductViewSet(viewsets.ModelViewSet):
    queryset = UniqueSolarProjectProduct.objects.all()
    serializer_class = UniqueSolarProjectProductSerializer
    
    def get_queryset(self):
        queryset = UniqueSolarProjectProduct.objects.all()
        project_id = self.request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

# Unique Solar Project Image views
class UniqueSolarProjectImageViewSet(viewsets.ModelViewSet):
    queryset = UniqueSolarProjectImage.objects.all()
    serializer_class = UniqueSolarProjectImageSerializer
    
    def get_queryset(self):
        queryset = UniqueSolarProjectImage.objects.all()
        project_id = self.request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

# Unique Solar Project Checklist views
class UniqueSolarProjectChecklistViewSet(viewsets.ModelViewSet):
    queryset = UniqueSolarProjectChecklist.objects.all()
    serializer_class = UniqueSolarProjectChecklistSerializer
    
    def get_queryset(self):
        queryset = UniqueSolarProjectChecklist.objects.all()
        project_id = self.request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
