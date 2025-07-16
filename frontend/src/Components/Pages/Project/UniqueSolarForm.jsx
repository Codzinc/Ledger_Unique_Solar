import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ProjectInformation from './Uniq_SubComp/ProjectInformation';
import ProductDetails from './Uniq_SubComp/ProductDetails';
import InstallationType from './Uniq_SubComp/InstallationType';
import TotalsSummary from './Uniq_SubComp/TotalsSummary';
import ReceiptUpload from './Uniq_SubComp/ReceiptUpload';
import PaymentTerms from './Uniq_SubComp/PaymentTerms';
import ProjectChecklist from './Uniq_SubComp/ProjectChecklist';

const INSTALLATION_PRICES = {
  standard: 5000,
  elevated: 8000,
  none: 0
};

const UniqueSolarForm = ({ onBack, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    customerName: '',
    contactno: '',
    address: '',
    date: '',
    validUntil: '',
    projectType: '',
    installationType: 'none',
    tax: '',
    advancePayment: '',
    deliveryPayment: '',
    completionPayment: '',
    status: 'DRAFT'
  });

  const [products, setProducts] = useState([
    { id: 3, type: 'Others', quantity: 0, unitPrice: 0, lineTotal: 0, customProduct: '' }
  ]);

  const [checklist, setChecklist] = useState({
    signedProposal: false,
    advancePaymentCheck: false,
    sanctionedLoad: false,
    cnicCopy: false,
    lastMonthBill: false,
    meterName: false
  });

  const [receiptImage, setReceiptImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevData => {
      const updatedData = { ...prevData };
      updatedData[name] = newValue;
      return updatedData;
    });
  };

  const handleProductChange = (id, field, value) => {
  setProducts(prevProducts => {
    return prevProducts.map(product => {
      if (product.id === id) {
        const updated = { ...product, [field]: value };

        // Parse values here safely
        const quantity = parseFloat(updated.quantity) || 0;
        const price = parseFloat(updated.unitPrice) || 0;

        updated.lineTotal = quantity * price;

        return updated;
      }
      return product;
    });
  });
};


  const addProduct = () => {
    setProducts(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'Select Product',
        quantity: 0,
        unitPrice: 0,
        lineTotal: 0
      }
    ]);
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleChecklistChange = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const subtotal = products.reduce((sum, p) => sum + (p.lineTotal || 0), 0);
  const installationCost = INSTALLATION_PRICES[formData.installationType] || 0;
  const taxAmount = ((subtotal + installationCost) * parseFloat(formData.tax || 0)) / 100;
  const grandTotal = subtotal + installationCost + taxAmount;

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setReceiptImage(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#181829] text-white p-6 flex items-center gap-3">
          <button onClick={onBack} className="text-[#d8f276] hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">UNIQUE SOLAR PROJECT ENTRY</h2>
        </div>

        <div className="p-6 space-y-8">
          <ProjectInformation formData={formData} handleInputChange={handleInputChange} />
          <ProductDetails 
            products={products}
            handleProductChange={handleProductChange}
            addProduct={addProduct}
            removeProduct={removeProduct}
          />
          <InstallationType formData={formData} handleInputChange={handleInputChange} />
          <TotalsSummary 
            subtotal={subtotal}
            installationCost={installationCost}
            formData={formData}
            handleInputChange={handleInputChange}
            grandTotal={grandTotal}
          />
          <ReceiptUpload handleReceiptUpload={handleReceiptUpload} receiptImage={receiptImage} />
          <PaymentTerms formData={formData} handleInputChange={handleInputChange} />
          <ProjectChecklist checklist={checklist} handleChecklistChange={handleChecklistChange} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <button 
              onClick={onBack} 
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button 
              type="button" 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={onBack}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={() => {
                const submitData = {
                  ...formData,
                  products,
                  amount: grandTotal,
                  advanceReceived: parseFloat(formData.advancePayment) || 0,
                  pending: grandTotal - (parseFloat(formData.advancePayment) || 0),
                  checklist,
                  receiptImage: receiptImage ? URL.createObjectURL(receiptImage) : null
                };
                onSubmit(submitData);
              }}
              className="px-6 py-2 bg-[#181829] text-white rounded-lg hover:bg-[#d8f276] hover:text-[#181829]"
            >
              Save Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Section Heading Component
const Section = ({ title, children, dashed }) => (
  <div className={dashed ? 'border-2 border-dashed border-gray-200 rounded-lg p-6' : ''}>
    <h3 className="text-lg font-semibold text-[#181829] mb-4 flex items-center gap-2">
      <div className="w-2 h-2 bg-[#d8f276] rounded-full"></div>
      {title}
    </h3>
    {children}
  </div>
);

export default UniqueSolarForm;
