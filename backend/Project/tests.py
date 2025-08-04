from django.test import TestCase
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import UniqueSolarProject, UniqueSolarProjectImage
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

# Create your tests here.

class UniqueSolarProjectImageTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.project = UniqueSolarProject.objects.create(
            customer_name="Test Customer",
            address="Test Address",
            valid_until=timezone.now().date() + timedelta(days=30),
            project_type='on_grid',
            installation_type='standard',
            tax_percentage=Decimal('15.00')
        )
        
        # Create a simple test image file
        self.test_image = SimpleUploadedFile(
            "test_image.jpg",
            b"fake image content",
            content_type="image/jpeg"
        )
    
    def test_image_creation_with_order(self):
        """Test that images are created with proper ordering"""
        # Create first image
        image1 = UniqueSolarProjectImage.objects.create(
            project=self.project,
            image=self.test_image
        )
        self.assertEqual(image1.order, 0)
        
        # Create second image
        image2 = UniqueSolarProjectImage.objects.create(
            project=self.project,
            image=self.test_image
        )
        self.assertEqual(image2.order, 1)
        
        # Verify images are ordered correctly
        images = self.project.images.all()
        self.assertEqual(images[0].order, 0)
        self.assertEqual(images[1].order, 1)
    
    def test_maximum_seven_images_limit(self):
        """Test that maximum 7 images are allowed per project"""
        # Create 7 images successfully
        for i in range(7):
            image = UniqueSolarProjectImage.objects.create(
                project=self.project,
                image=self.test_image
            )
            self.assertEqual(image.order, i)
        
        # Verify we have 7 images
        self.assertEqual(self.project.images.count(), 7)
        
        # Try to create an 8th image - should raise ValidationError
        with self.assertRaises(ValidationError):
            UniqueSolarProjectImage.objects.create(
                project=self.project,
                image=self.test_image
            )
    
    def test_image_string_representation(self):
        """Test the string representation of images"""
        image = UniqueSolarProjectImage.objects.create(
            project=self.project,
            image=self.test_image
        )
        expected_string = f"{self.project.project_id} - Image 0"
        self.assertEqual(str(image), expected_string)
    
    def test_unique_together_constraint(self):
        """Test that project and order combination is unique"""
        # Create first image
        UniqueSolarProjectImage.objects.create(
            project=self.project,
            image=self.test_image
        )
        
        # Try to create another image with the same order - should fail
        with self.assertRaises(Exception):  # This will be an IntegrityError in real DB
            UniqueSolarProjectImage.objects.create(
                project=self.project,
                image=self.test_image,
                order=0  # Same order as first image
            )
