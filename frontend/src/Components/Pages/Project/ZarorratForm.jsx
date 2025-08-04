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
    status: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedServices, setSelectedServices] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (serviceId) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'This field is required';
    if (!formData.contact_no.trim()) newErrors.contact_no = 'This field is required';
    if (!formData.address.trim()) newErrors.address = 'This field is required';
    if (!formData.date) newErrors.date = 'This field is required';
    if (!formData.validUntil) newErrors.validUntil = 'This field is required';
    if (!formData.status) newErrors.status = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalAmount = parseFloat(formData.amount) || 0;
  const advanceReceived = parseFloat(formData.advanceReceived) || 0;
  const pendingAmount = totalAmount - advanceReceived;

  const handleFormSubmit = () => {
    if (!validate()) return;

    const submitData = {
      ...formData,
      selectedServices,
      amount: totalAmount,
      advanceReceived,
      pending: pendingAmount,
      projectType: 'Service from Zarorrat',
      status: formData.status || 'DRAFT'
    };

    onSubmit(submitData);
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

        <div className="p-6 space-y-8">
          <BasicInformation
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <ServicesProvided
            selectedServices={selectedServices}
            handleServiceChange={handleServiceChange}
          />

          <NotesAndAmount
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <PaymentSummary
            totalAmount={totalAmount}
            formData={formData}
            handleInputChange={handleInputChange}
            pendingAmount={pendingAmount}
          />

          <ActionButtons
            onBack={onBack}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ZarorratForm;
