import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import BasicInformation from './Zarorrat_SubComp/BasicInformation';
import ServicesProvided from './Zarorrat_SubComp/ServicesProvided';
import NotesAndAmount from './Zarorrat_SubComp/NotesAndAmount';
import PaymentSummary from './Zarorrat_SubComp/PaymentSummary';
import ActionButtons from './Zarorrat_SubComp/ActionButtons';
import { createZarorratProject, getZarorratServices } from '../../../ApiComps/Project/ZarorratApi';

const ZarorratForm = ({ onBack, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    customer_name: '',
    contact_number: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    valid_until: '',
    notes: '',
    amount: '',
    advance_received: '',
    status: ''
  });

  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await getZarorratServices();
        setAvailableServices(services);
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };
    
    loadServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));

    setApiErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleServiceChange = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) newErrors.customer_name = 'This field is required';
    if (!formData.contact_number.trim()) newErrors.contact_number = 'This field is required';
    if (!formData.address.trim()) newErrors.address = 'This field is required';
    if (!formData.date) newErrors.date = 'This field is required';
    if (!formData.valid_until) newErrors.valid_until = 'This field is required';
    if (!formData.status) newErrors.status = 'This field is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalAmount = parseFloat(formData.amount) || 0;
  const advanceReceived = parseFloat(formData.advance_received) || 0;
  const pendingAmount = totalAmount - advanceReceived;

 const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  if (!validate()) return;

  setIsSubmitting(true);
  setApiErrors({});

  try {
    // ✅ CORRECT API DATA MAPPING
    const submitData = {
      customer_name: formData.customer_name,
      contact_number: formData.contact_number, // ✅ This will now be saved in backend
      address: formData.address,
      date: formData.date,
      valid_until: formData.valid_until,
      notes: formData.notes || '',
      amount: totalAmount.toFixed(2),
      advance_received: advanceReceived.toFixed(2), // ✅ Correct backend field name
      status: formData.status,
      service_ids: selectedServices // ✅ Correct field name for services
    };

    console.log('✅ Submitting Zarorrat data:', submitData);

    const response = await createZarorratProject(submitData);
    
    if (onSubmit) {
      onSubmit(response);
    }
    
    alert('Zarorrat project created successfully!');
    
  } catch (error) {
    console.error('Error submitting Zarorrat form:', error);
    
    if (error.message.includes('Validation failed:')) {
      setApiErrors({ general: error.message });
    } else {
      let errorMessage = 'Error creating project. Please try again.';
      
      if (error.response) {
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
        <div className="bg-[#181829] text-white p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-[#d8f276] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">ZARORRAT.COM PROJECT ENTRY</h2>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="p-6 space-y-8">
            {/* API Error Message */}
            {apiErrors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {apiErrors.general}
              </div>
            )}

            <BasicInformation
              formData={formData}
              handleInputChange={handleInputChange}
              errors={{...errors, ...apiErrors}}
            />

            <ServicesProvided
              selectedServices={selectedServices}
              handleServiceChange={handleServiceChange}
              availableServices={availableServices}
            />

            <NotesAndAmount
              formData={formData}
              handleInputChange={handleInputChange}
              errors={{...errors, ...apiErrors}}
            />

            <PaymentSummary
              totalAmount={totalAmount}
              formData={formData}
              handleInputChange={handleInputChange}
              pendingAmount={pendingAmount}
            />

            <ActionButtons
              onBack={onBack}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZarorratForm;