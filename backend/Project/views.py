from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from django.db import transaction
import json
from .models import (
    ZarorratService,
    ZarorratProject,
    UniqueSolarProject,
    UniqueSolarChecklist,
    UniqueSolarProjectProduct,
    UniqueSolarProjectImage,
    UniqueSolarProjectChecklist
)
from .serializers import (
    ZarorratServiceSerializer,
    ZarorratProjectSerializer,
    ZarorratProjectServiceSerializer,
    UniqueSolarProjectSerializer,
    UniqueSolarChecklistSerializer,
    UniqueSolarProjectProductSerializer,
    UniqueSolarProjectImageSerializer
)

class ZarorratProjectPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100




# Zarorrat Service views
class ZarorratServiceListView(APIView):
    """
    Zarorrat Service List View
    
    This view handles:
    - GET: Retrieve all zarorrat services with optional filtering
    
    Query Parameters:
    - is_active: Filter services by active status (true/false)
    
    Zarorrat services are emergency/urgent services offered by the company.
    """
    def get(self, request):
        queryset = ZarorratService.objects.all()
        is_active = request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        serializer = ZarorratServiceSerializer(queryset, many=True)
        return Response(serializer.data)


# Zarorrat Project views
class ZarorratProjectListView(APIView):
    """
    Zarorrat Project List View
    
    This view handles:
    - GET: Retrieve all zarorrat projects with optional filtering and pagination
    
    Query Parameters:
    - status: Filter projects by status (e.g., 'pending', 'in_progress', 'completed')
    - page: Page number for pagination (default: 1)
    - page_size: Number of items per page (default: 10, max: 100)
    
    Zarorrat projects are emergency/urgent projects that require immediate attention.
    """
    pagination_class = ZarorratProjectPagination
    
    def get(self, request):
        queryset = ZarorratProject.objects.all()
        status_filter = request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Apply pagination
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        serializer = ZarorratProjectSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

class ZarorratProjectCreateView(APIView):
    """
    Zarorrat Project Create View
    
    This view handles:
    - POST: Create a new zarorrat project
    
    Used for creating new emergency/urgent projects.
    """
    def post(self, request):
        serializer = ZarorratProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ZarorratProjectDetailView(APIView):
    """
    Zarorrat Project Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific zarorrat project by project_id
    - PUT/PATCH: Update a zarorrat project
    - DELETE: Delete a zarorrat project
    
    Provides full CRUD operations for individual zarorrat projects.
    """
    def get(self, request, project_id):
        project = get_object_or_404(ZarorratProject, project_id=project_id)
        serializer = ZarorratProjectSerializer(project)
        return Response(serializer.data)
    
    def put(self, request, project_id):
        project = get_object_or_404(ZarorratProject, project_id=project_id)
        serializer = ZarorratProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_id):
        project = get_object_or_404(ZarorratProject, project_id=project_id)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ZarorratProjectServicesView(APIView):
    """
    Zarorrat Project Services View
    
    This view handles:
    - GET: Retrieve all services associated with a specific zarorrat project
    
    Returns a list of services that are linked to the specified zarorrat project.
    This helps in viewing what services are being provided for a particular project.
    """
    def get(self, request, project_id):
        project = get_object_or_404(ZarorratProject, project_id=project_id)
        services = project.selected_services.all()
        serializer = ZarorratProjectServiceSerializer(services, many=True)
        return Response(serializer.data)



# Unique Solar Project views
class UniqueSolarProjectListView(APIView):
    """
    Unique Solar Project List View
    
    This view handles:
    - GET: Retrieve all unique solar projects with optional filtering
    
    Query Parameters:
    - status: Filter projects by status (e.g., 'planning', 'installation', 'completed')
    - installation_type: Filter by installation type (e.g., 'residential', 'commercial')
    
    Unique solar projects are comprehensive solar energy installations
    that include products, images, and checklist items.
    """
    def get(self, request):
        queryset = UniqueSolarProject.objects.all()
        status_filter = request.query_params.get('status', None)
        installation_type = request.query_params.get('installation_type', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if installation_type:
            queryset = queryset.filter(installation_type=installation_type)
        
        serializer = UniqueSolarProjectSerializer(queryset, many=True)
        return Response(serializer.data)

class UniqueSolarProjectCreateView(APIView):
    """
    Unique Solar Project Create View
    
    This view handles:
    - POST: Create a new unique solar project with nested products, images, and checklist items
    
    Used for creating new comprehensive solar energy installations.
    """
    def post(self, request):
        try:
            with transaction.atomic():
                data = request.data.copy()
                
                products_data = []
                if 'products' in data:
                    products_raw = data.pop('products')
                    if isinstance(products_raw, str):
                        try:
                            products_data = json.loads(products_raw)
                        except json.JSONDecodeError:
                            return Response({'error': 'Invalid JSON format for products'}, status=status.HTTP_400_BAD_REQUEST)
                    elif isinstance(products_raw, list):
                        products_data = products_raw
                    else:
                        return Response({'error': 'Products must be a JSON string or list'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    if not isinstance(products_data, list):
                        return Response({'error': 'Products must be a list/array'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    flattened_products = []
                    for item in products_data:
                        if isinstance(item, dict):
                            flattened_products.append(item)
                        elif isinstance(item, list):
                            flattened_products.extend([i for i in item if isinstance(i, dict)])
                        elif isinstance(item, str):
                            try:
                                parsed = json.loads(item)
                                if isinstance(parsed, dict):
                                    flattened_products.append(parsed)
                                elif isinstance(parsed, list):
                                    flattened_products.extend([i for i in parsed if isinstance(i, dict)])
                            except json.JSONDecodeError:
                                continue
                    
                    products_data = flattened_products
                checklist_ids = []
                if 'checklist_ids' in data:
                    checklist_raw = data.pop('checklist_ids')
          
                    if isinstance(checklist_raw, str):
                        try:
                            checklist_ids = json.loads(checklist_raw)
                            print(f"DEBUG: Parsed checklist_ids: {checklist_ids}")
                        except json.JSONDecodeError:
                            return Response({'error': 'Invalid JSON format for checklist_ids'}, status=status.HTTP_400_BAD_REQUEST)
                    elif isinstance(checklist_raw, list):
                        parsed_checklist_ids = []
                        for item in checklist_raw:
                            if isinstance(item, str):
                                try:
                                    parsed_item = json.loads(item)
                                    if isinstance(parsed_item, list):
                                        parsed_checklist_ids.extend(parsed_item)
                                    else:
                                        parsed_checklist_ids.append(parsed_item)
                                except json.JSONDecodeError:
                                    try:
                                        parsed_checklist_ids.append(int(item))
                                    except (ValueError, TypeError):
                                        return Response({'error': f'Invalid checklist ID: {item}'}, status=status.HTTP_400_BAD_REQUEST)
                            else:
                                parsed_checklist_ids.append(item)
                        checklist_ids = parsed_checklist_ids
                        print(f"DEBUG: Parsed checklist_ids from list: {checklist_ids}")
                    else:
                        return Response({'error': 'Checklist IDs must be a JSON string or list'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    if not isinstance(checklist_ids, list):
                        checklist_ids = [checklist_ids]
                    

                    try:
                        converted_ids = []
                        for i, item in enumerate(checklist_ids):
                            if item is None or item == '':
                                continue 
                            try:
                                converted_ids.append(int(item))
                            except (ValueError, TypeError) as e:
                                print(f"DEBUG: Failed to convert item {i}: {item} (type: {type(item)}) - Error: {e}")
                                return Response({'error': f'Checklist ID at position {i} must be a valid integer. Got: {item}'}, status=status.HTTP_400_BAD_REQUEST)
                        
                        checklist_ids = converted_ids
                        print(f"DEBUG: After integer conversion: {checklist_ids}")
                    except Exception as e:
                        print(f"DEBUG: Unexpected error during conversion: {e}")
                        return Response({'error': f'Error converting checklist IDs to integers: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Handle images
                images_data = []
                if 'images' in request.FILES:
                    for image_file in request.FILES.getlist('images'):
                        images_data.append({'image': image_file})
                
                # Create the main project
                serializer = UniqueSolarProjectSerializer(data=data)
                if not serializer.is_valid():
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                project = serializer.save()
                
                # Create products
                for product_data in products_data:
                    product_data['project'] = project.id
                    product_serializer = UniqueSolarProjectProductSerializer(data=product_data)
                    if not product_serializer.is_valid():
                        raise serializers.ValidationError(f"Product validation error: {product_serializer.errors}")
                    product_serializer.save()
                
                # Create images
                for image_data in images_data:
                    image_data['project'] = project.id
                    image_serializer = UniqueSolarProjectImageSerializer(data=image_data)
                    if not image_serializer.is_valid():
                        raise serializers.ValidationError(f"Image validation error: {image_serializer.errors}")
                    image_serializer.save()
                
                # Create checklist items
                for checklist_id in checklist_ids:
                    try:
                        checklist = UniqueSolarChecklist.objects.get(id=checklist_id, is_active=True)
                        UniqueSolarProjectChecklist.objects.create(
                            project=project,
                            checklist=checklist
                        )
                    except UniqueSolarChecklist.DoesNotExist:
                        raise serializers.ValidationError(f"Checklist item with ID {checklist_id} not found or inactive")
                
                # Return the complete project data
                complete_serializer = UniqueSolarProjectSerializer(project)
                return Response(complete_serializer.data, status=status.HTTP_201_CREATED)
                    
        except serializers.ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            return Response({
                'error': 'An unexpected error occurred',
                'details': str(e),
                'traceback': error_details
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UniqueSolarProjectDetailView(APIView):
    """
    Unique Solar Project Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific unique solar project by ID
    - PUT/PATCH: Update a unique solar project
    - DELETE: Delete a unique solar project
    
    Provides full CRUD operations for individual unique solar projects.
    """
    def get(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        serializer = UniqueSolarProjectSerializer(project)
        return Response(serializer.data)
    
    def put(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        serializer = UniqueSolarProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Unique Solar Project Checklist views
class UniqueSolarChecklistListView(APIView):
    """
    Unique Solar Project Checklist List View
    
    This view handles:
    - GET: Retrieve all checklist items with optional filtering
    
    Query Parameters:
    - project: Filter by specific project ID
    
    Manages project checklist items independently, allowing bulk operations
    on checklist items across multiple projects.
    """
    def get(self, request):
        queryset = UniqueSolarChecklist.objects.all()
        project_id = request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        serializer = UniqueSolarChecklistSerializer(queryset, many=True)
        return Response(serializer.data)
