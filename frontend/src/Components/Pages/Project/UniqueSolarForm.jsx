import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ProjectInformation from './Uniq_SubComp/ProjectInformation';
import ProductDetails from './Uniq_SubComp/ProductDetails';
import InstallationType from './Uniq_SubComp/InstallationType';
import TotalsSummary from './Uniq_SubComp/TotalsSummary';
import ReceiptUpload from './Uniq_SubComp/ReceiptUpload';
import PaymentTerms from './Uniq_SubComp/PaymentTerms';
import ProjectChecklist from './Uniq_SubComp/ProjectChecklist';
import { createUniqueSolarProject, getChecklistItems } from '../../../ApiComps/Project/UniqueSolarApi';

const UniqueSolarForm = ({ onBack, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    customer_name: '',
    contact_no: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    valid_until: '',
    project_type: '',
    installation_type: 'no_installation',
    tax_percentage: '',
    advance_payment: '',
    status: '',
    installation_amount: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [products, setProducts] = useState([
    { id: Date.now(), product_type: '', specify_product: '', quantity: "", unit_price: '', line_total: '' }
  ]);

  const [checklist, setChecklist] = useState({});
  const [checklistItems, setChecklistItems] = useState([]);
  const [receiptImage, setReceiptImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  // Load checklist items from API
  useEffect(() => {
    const loadChecklistItems = async () => {
      try {
        const items = await getChecklistItems();
        setChecklistItems(items);
        
        // Initialize checklist state
        const initialChecklist = {};
        items.forEach(item => {
          initialChecklist[item.item_name.toLowerCase().replace(/\s+/g, '_')] = false;
        });
        setChecklist(initialChecklist);
      } catch (error) {
        console.error('Error loading checklist items:', error);
      }
    };
    
    loadChecklistItems();
  }, []);

  // Add this useEffect for automatic payment calculation
useEffect(() => {
  const advance = parseFloat(formData.advance_payment) || 0;
  const total = parseFloat(formData.total_payment) || 0;
  const pending = total - advance;
  
  if (pending !== parseFloat(formData.completion_payment || 0)) {
    setFormData(prev => ({
      ...prev,
      completion_payment: pending > 0 ? pending.toString() : "0"
    }));
  }
}, [formData.advance_payment, formData.total_payment]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));

    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));

    setApiErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.customer_name.trim()) errors.customer_name = "This field is required";
    if (!formData.contact_no.trim()) errors.contact_no = "This field is required";
    if (!formData.address.trim()) errors.address = "This field is required";
    if (!formData.date.trim()) errors.date = "This field is required";
    if (!formData.valid_until.trim()) errors.valid_until = "This field is required";
    if (!formData.project_type.trim()) errors.project_type = "This field is required";
    if (!formData.status.trim()) errors.status = "This field is required";
    
    // Installation type validation
    if (formData.installation_type === 'standard' || formData.installation_type === 'elevated') {
      if (!formData.installation_amount || formData.installation_amount <= 0) {
        errors.installation_amount = "Installation amount is required";
      }
    }
    
    // Product validation
    let hasProductErrors = false;
    products.forEach((product, index) => {
      if (!product.product_type.trim()) {
        errors[`products[${product.id}].product_type`] = "Product type is required";
        hasProductErrors = true;
      }
      if (product.product_type === "Others" && !product.specify_product.trim()) {
        errors[`products[${product.id}].specify_product`] = "Please specify the product";
        hasProductErrors = true;
      }
      if (!product.quantity || product.quantity <= 0) {
        errors[`products[${product.id}].quantity`] = "Quantity is required";
        hasProductErrors = true;
      }
      if (!product.unit_price || product.unit_price <= 0) {
        errors[`products[${product.id}].unit_price`] = "Unit price is required";
        hasProductErrors = true;
      }
    });
    
    if (hasProductErrors) {
      errors.products = "Please fill all product details";
    }
    
    return errors;
  };

  const handleProductChange = (id, field, value) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === id) {
          const updated = { ...product, [field]: value };
          
          // Calculate line total if quantity or unit price changes
          if (field === 'quantity' || field === 'unit_price') {
            const quantity = parseFloat(updated.quantity) || 0;
            const price = parseFloat(updated.unit_price) || 0;
            updated.line_total = (quantity * price).toFixed(2);
          }
          
          return updated;
        }
        return product;
      })
    );
  };

  const addProduct = () => {
    setProducts(prev => [
      ...prev,
      {
        id: Date.now(),
        product_type: '',
        specify_product: '',
        quantity: "",
        unit_price: '',
        line_total: ''
      }
    ]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleChecklistChange = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const subtotal = products.reduce((sum, p) => sum + (parseFloat(p.line_total) || 0), 0);
  const installationCost = (formData.installation_type !== 'no_installation')
    ? parseFloat(formData.installation_amount) || 0
    : 0;
  const taxAmount = ((subtotal + installationCost) * parseFloat(formData.tax_percentage || 0)) / 100;
  const grandTotal = subtotal + installationCost + taxAmount;

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    setApiErrors({});

    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API - ensure proper formatting
      const apiData = {
        customer_name: formData.customer_name,
        contact_no: formData.contact_no.toString(), // Ensure string format
        address: formData.address,
        date: formData.date,
        valid_until: formData.valid_until,
        project_type: formData.project_type,
        installation_type: formData.installation_type,
        tax_percentage: formData.tax_percentage || "0.00",
        advance_payment: formData.advance_payment || "0.00",
        total_payment: grandTotal.toFixed(2),
        completion_payment: (grandTotal - (parseFloat(formData.advance_payment) || 0)).toFixed(2),
        status: formData.status,
        products: products.map(product => ({
          product_type: product.product_type,
          specify_product: product.specify_product || '',
          quantity: product.quantity.toString(),
          unit_price: product.unit_price.toString(),
          line_total: product.line_total.toString()
        })),
        checklist: Object.keys(checklist).filter(key => checklist[key])
      };

      // Add installation amount if applicable
      if (formData.installation_type !== 'no_installation' && formData.installation_amount) {
        apiData.installation_amount = formData.installation_amount.toString();
      }

      console.log('Submitting data to API:', apiData);

      const response = await createUniqueSolarProject(apiData);
      
      // Call the onSubmit callback with the response data
      if (onSubmit) {
        onSubmit(response);
      }
      
      // Show success message
      alert('Project created successfully!');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle API validation errors
      if (error.message.includes('Validation failed:')) {
        setApiErrors({ general: error.message });
      } else {
        let errorMessage = 'Error creating project. Please try again.';
        
        if (error.response) {
          // Extract field-specific errors from API response
          const apiErrorData = error.response.data;
          const fieldErrors = {};
          
          Object.keys(apiErrorData).forEach(field => {
            fieldErrors[field] = apiErrorData[field].join(', ');
          });
          
          setApiErrors(fieldErrors);
          errorMessage = 'Please check the form for errors.';
        } else if (error.request) {
          errorMessage = 'No response from server. Please check your connection.';
        }
        
        setApiErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#181829] text-white p-6 flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack} 
            className="text-[#d8f276] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">UNIQUE SOLAR PROJECT ENTRY</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-8">
            {/* API Error Message */}
            {apiErrors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {apiErrors.general}
              </div>
            )}

            <ProjectInformation
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={{...formErrors, ...apiErrors}}
            />
            <ProductDetails
              products={products}
              handleProductChange={handleProductChange}
              addProduct={addProduct}
              removeProduct={removeProduct}
              formErrors={{...formErrors, ...apiErrors}}
            />
            <InstallationType 
              formData={formData} 
              handleInputChange={handleInputChange}
              formErrors={{...formErrors, ...apiErrors}}
            />
            <TotalsSummary
              subtotal={subtotal}
              installationCost={installationCost}
              formData={formData}
              handleInputChange={handleInputChange}
              grandTotal={grandTotal}
            />
            <ReceiptUpload handleReceiptUpload={handleReceiptUpload} receiptImage={receiptImage} />
            <PaymentTerms formData={formData} handleInputChange={handleInputChange} />
            <ProjectChecklist 
              checklist={checklist} 
              handleChecklistChange={handleChecklistChange} 
              checklistItems={checklistItems}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#181829] text-white rounded-lg hover:bg-[#d8f276] hover:text-[#181829] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniqueSolarForm;