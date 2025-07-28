from rest_framework import status
from rest_framework.views import APIView
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
class ProjectListView(APIView):
    """
    Legacy Project List View
    
    This view handles:
    - GET: Retrieve all legacy projects
    
    Used for managing basic project information before the specialized
    Zarorrat and Unique Solar project types were introduced.
    """
    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class ProjectCreateView(APIView):
    """
    Legacy Project Create View
    
    This view handles:
    - POST: Create a new legacy project
    
    Used for creating new basic project information.
    """
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetailView(APIView):
    """
    Legacy Project Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific legacy project by ID
    - PUT/PATCH: Update a legacy project
    - DELETE: Delete a legacy project
    
    Provides full CRUD operations for individual legacy projects.
    """
    def get(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    
    def put(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

class ZarorratServiceCreateView(APIView):
    """
    Zarorrat Service Create View
    
    This view handles:
    - POST: Create a new zarorrat service
    
    Used for creating new emergency/urgent services.
    """
    def post(self, request):
        serializer = ZarorratServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ZarorratServiceDetailView(APIView):
    """
    Zarorrat Service Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific zarorrat service by ID
    - PUT/PATCH: Update a zarorrat service
    - DELETE: Delete a zarorrat service
    
    Provides full CRUD operations for individual zarorrat services.
    """
    def get(self, request, pk):
        service = get_object_or_404(ZarorratService, pk=pk)
        serializer = ZarorratServiceSerializer(service)
        return Response(serializer.data)
    
    def put(self, request, pk):
        service = get_object_or_404(ZarorratService, pk=pk)
        serializer = ZarorratServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        service = get_object_or_404(ZarorratService, pk=pk)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Zarorrat Project views
class ZarorratProjectListView(APIView):
    """
    Zarorrat Project List View
    
    This view handles:
    - GET: Retrieve all zarorrat projects with optional filtering
    
    Query Parameters:
    - status: Filter projects by status (e.g., 'pending', 'in_progress', 'completed')
    
    Zarorrat projects are emergency/urgent projects that require immediate attention.
    """
    def get(self, request):
        queryset = ZarorratProject.objects.all()
        status_filter = request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        serializer = ZarorratProjectSerializer(queryset, many=True)
        return Response(serializer.data)

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
    - GET: Retrieve a specific zarorrat project by ID
    - PUT/PATCH: Update a zarorrat project
    - DELETE: Delete a zarorrat project
    
    Provides full CRUD operations for individual zarorrat projects.
    """
    def get(self, request, pk):
        project = get_object_or_404(ZarorratProject, pk=pk)
        serializer = ZarorratProjectSerializer(project)
        return Response(serializer.data)
    
    def put(self, request, pk):
        project = get_object_or_404(ZarorratProject, pk=pk)
        serializer = ZarorratProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        project = get_object_or_404(ZarorratProject, pk=pk)
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
    def get(self, request, pk):
        project = get_object_or_404(ZarorratProject, pk=pk)
        services = project.selected_services.all()
        serializer = ZarorratProjectServiceSerializer(services, many=True)
        return Response(serializer.data)

# Unique Solar Product views
class UniqueSolarProductListView(APIView):
    """
    Unique Solar Product List View
    
    This view handles:
    - GET: Retrieve all unique solar products with optional filtering
    
    Query Parameters:
    - product_type: Filter products by type (e.g., 'panel', 'inverter', 'battery')
    
    Unique solar products are solar energy equipment and components
    that can be used in solar projects.
    """
    def get(self, request):
        queryset = UniqueSolarProduct.objects.all()
        product_type = request.query_params.get('product_type', None)
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        serializer = UniqueSolarProductSerializer(queryset, many=True)
        return Response(serializer.data)

class UniqueSolarProductCreateView(APIView):
    """
    Unique Solar Product Create View
    
    This view handles:
    - POST: Create a new unique solar product
    
    Used for creating new solar energy equipment and components.
    """
    def post(self, request):
        serializer = UniqueSolarProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UniqueSolarProductDetailView(APIView):
    """
    Unique Solar Product Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific unique solar product by ID
    - PUT/PATCH: Update a unique solar product
    - DELETE: Delete a unique solar product
    
    Provides full CRUD operations for individual unique solar products.
    """
    def get(self, request, pk):
        product = get_object_or_404(UniqueSolarProduct, pk=pk)
        serializer = UniqueSolarProductSerializer(product)
        return Response(serializer.data)
    
    def put(self, request, pk):
        product = get_object_or_404(UniqueSolarProduct, pk=pk)
        serializer = UniqueSolarProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        product = get_object_or_404(UniqueSolarProduct, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    - POST: Create a new unique solar project
    
    Used for creating new comprehensive solar energy installations.
    """
    def post(self, request):
        serializer = UniqueSolarProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class UniqueSolarProjectProductsView(APIView):
    """
    Unique Solar Project Products View
    
    This view handles:
    - GET: Retrieve all products associated with a specific unique solar project
    - POST: Add a new product to a specific unique solar project
    
    Manages the relationship between solar projects and their associated products.
    Each project can have multiple products (panels, inverters, batteries, etc.).
    """
    def get(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        products = project.products.all()
        serializer = UniqueSolarProjectProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def post(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        serializer = UniqueSolarProjectProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UniqueSolarProjectImagesView(APIView):
    """
    Unique Solar Project Images View
    
    This view handles:
    - GET: Retrieve all images associated with a specific unique solar project
    - POST: Add a new image to a specific unique solar project
    
    Manages project documentation through images. This can include:
    - Site photos before installation
    - Progress photos during installation
    - Final completion photos
    - Technical diagrams and schematics
    """
    def get(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        images = project.images.all()
        serializer = UniqueSolarProjectImageSerializer(images, many=True)
        return Response(serializer.data)
    
    def post(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        serializer = UniqueSolarProjectImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UniqueSolarProjectChecklistView(APIView):
    """
    Unique Solar Project Checklist View
    
    This view handles:
    - GET: Retrieve all checklist items associated with a specific unique solar project
    - POST: Add a new checklist item to a specific unique solar project
    
    Manages project completion checklists. Checklist items can include:
    - Pre-installation requirements
    - Installation steps
    - Safety checks
    - Quality assurance items
    - Post-installation verification
    """
    def get(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        checklist_items = project.checklist_items.all()
        serializer = UniqueSolarProjectChecklistSerializer(checklist_items, many=True)
        return Response(serializer.data)
    
    def post(self, request, pk):
        project = get_object_or_404(UniqueSolarProject, pk=pk)
        serializer = UniqueSolarProjectChecklistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Unique Solar Project Product views
class UniqueSolarProjectProductListView(APIView):
    """
    Unique Solar Project Product List View
    
    This view handles:
    - GET: Retrieve all project-product relationships with optional filtering
    
    Query Parameters:
    - project: Filter by specific project ID
    
    Manages the many-to-many relationship between projects and products,
    including quantities, specifications, and pricing for each product in a project.
    """
    def get(self, request):
        queryset = UniqueSolarProjectProduct.objects.all()
        project_id = request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        serializer = UniqueSolarProjectProductSerializer(queryset, many=True)
        return Response(serializer.data)

class UniqueSolarProjectProductCreateView(APIView):
    """
    Unique Solar Project Product Create View
    
    This view handles:
    - POST: Create a new project-product relationship
    
    Used for creating new relationships between projects and products.
    """
    def post(self, request):
        serializer = UniqueSolarProjectProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UniqueSolarProjectProductDetailView(APIView):
    """
    Unique Solar Project Product Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific project-product relationship by ID
    - PUT/PATCH: Update a project-product relationship
    - DELETE: Delete a project-product relationship
    
    Provides full CRUD operations for individual project-product relationships,
    allowing modification of quantities, specifications, or removal of products from projects.
    """
    def get(self, request, pk):
        product = get_object_or_404(UniqueSolarProjectProduct, pk=pk)
        serializer = UniqueSolarProjectProductSerializer(product)
        return Response(serializer.data)
    
    def put(self, request, pk):
        product = get_object_or_404(UniqueSolarProjectProduct, pk=pk)
        serializer = UniqueSolarProjectProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        product = get_object_or_404(UniqueSolarProjectProduct, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Unique Solar Project Image views
class UniqueSolarProjectImageListView(APIView):
    """
    Unique Solar Project Image List View
    
    This view handles:
    - GET: Retrieve all project images with optional filtering
    
    Query Parameters:
    - project: Filter by specific project ID
    
    Manages project documentation images independently, allowing bulk operations
    on project images across multiple projects.
    """
    def get(self, request):
        queryset = UniqueSolarProjectImage.objects.all()
        project_id = request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        serializer = UniqueSolarProjectImageSerializer(queryset, many=True)
        return Response(serializer.data)

class UniqueSolarProjectImageCreateView(APIView):
    """
    Unique Solar Project Image Create View
    
    This view handles:
    - POST: Create a new project image
    
    Used for creating new project documentation images.
    """
    def post(self, request):
        serializer = UniqueSolarProjectImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UniqueSolarProjectImageDetailView(APIView):
    """
    Unique Solar Project Image Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific project image by ID
    - PUT/PATCH: Update a project image (metadata, description, etc.)
    - DELETE: Delete a project image
    
    Provides full CRUD operations for individual project images,
    allowing updates to image metadata or removal of images.
    """
    def get(self, request, pk):
        image = get_object_or_404(UniqueSolarProjectImage, pk=pk)
        serializer = UniqueSolarProjectImageSerializer(image)
        return Response(serializer.data)
    
    def put(self, request, pk):
        image = get_object_or_404(UniqueSolarProjectImage, pk=pk)
        serializer = UniqueSolarProjectImageSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        image = get_object_or_404(UniqueSolarProjectImage, pk=pk)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Unique Solar Project Checklist views
class UniqueSolarProjectChecklistListView(APIView):
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
        queryset = UniqueSolarProjectChecklist.objects.all()
        project_id = request.query_params.get('project', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        serializer = UniqueSolarProjectChecklistSerializer(queryset, many=True)
        return Response(serializer.data)

class UniqueSolarProjectChecklistCreateView(APIView):
    """
    Unique Solar Project Checklist Create View
    
    This view handles:
    - POST: Create a new checklist item
    
    Used for creating new project checklist items.
    """
    def post(self, request):
        serializer = UniqueSolarProjectChecklistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UniqueSolarProjectChecklistDetailView(APIView):
    """
    Unique Solar Project Checklist Detail, Update, and Delete View
    
    This view handles:
    - GET: Retrieve a specific checklist item by ID
    - PUT/PATCH: Update a checklist item (status, notes, completion date, etc.)
    - DELETE: Delete a checklist item
    
    Provides full CRUD operations for individual checklist items,
    allowing updates to item status, completion, or removal of items.
    """
    def get(self, request, pk):
        checklist_item = get_object_or_404(UniqueSolarProjectChecklist, pk=pk)
        serializer = UniqueSolarProjectChecklistSerializer(checklist_item)
        return Response(serializer.data)
    
    def put(self, request, pk):
        checklist_item = get_object_or_404(UniqueSolarProjectChecklist, pk=pk)
        serializer = UniqueSolarProjectChecklistSerializer(checklist_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        checklist_item = get_object_or_404(UniqueSolarProjectChecklist, pk=pk)
        checklist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
