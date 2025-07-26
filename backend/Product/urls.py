from django.urls import path
from . import views

app_name = 'product'

urlpatterns = [
    path('create/', views.CreateProductView.as_view(), name='create_product'),
    path('list/', views.ListProductsView.as_view(), name='list_products'),
    path('get-product/<int:product_id>/', views.RetrieveProductView.as_view(), name='retrieve_product'),
    path('<int:product_id>/update/', views.UpdateProductView.as_view(), name='update_product'),
    path('<int:product_id>/delete/', views.DeleteProductView.as_view(), name='delete_product'),
    path('<int:product_id>/image/<int:image_id>/delete/', views.DeleteProductImageView.as_view(), name='delete_product_image'),
] 