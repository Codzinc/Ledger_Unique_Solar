import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import BasicInformation from './Zarorrat_SubComp/BasicInformation';
import ServicesProvided from './Zarorrat_SubComp/ServicesProvided';
import NotesAndAmount from './Zarorrat_SubComp/NotesAndAmount';
import PaymentSummary from './Zarorrat_SubComp/PaymentSummary';
import ActionButtons from './Zarorrat_SubComp/ActionButtons';

const ZarorratForm = ({ onBack, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    customerName: '',
    contact_no: '',
    address: '',
    date: '',
    validUntil: '',
    notes: '',
    amount: '',
    advanceReceived: '',
    projectType: '',
    status: 'DRAFT'
  });

  const [selectedServices, setSelectedServices] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (serviceId) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const totalAmount = parseFloat(formData.amount) || 0;
  const advanceReceived = parseFloat(formData.advanceReceived) || 0;
  const pendingAmount = totalAmount - advanceReceived;

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

        <div className="p-6 space-y-8">
          <BasicInformation formData={formData} handleInputChange={handleInputChange} />
          <ServicesProvided selectedServices={selectedServices} handleServiceChange={handleServiceChange} />
          <NotesAndAmount formData={formData} handleInputChange={handleInputChange} />
          <PaymentSummary 
            totalAmount={totalAmount}
            formData={formData}
            handleInputChange={handleInputChange}
            pendingAmount={pendingAmount}
          />
          <ActionButtons 
            onBack={onBack}
            onSubmit={() => {
              const submitData = {
                ...formData,
                selectedServices,
                amount: totalAmount,
                advanceReceived,
                pending: pendingAmount,
                projectType: formData.projectType || 'Service Call',
                status: formData.status || 'DRAFT'
              };
              onSubmit(submitData);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ZarorratForm;