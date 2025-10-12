import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import ProjectInformation from "./Uniq_SubComp/ProjectInformation";
import ProductDetails from "./Uniq_SubComp/ProductDetails";
import InstallationType from "./Uniq_SubComp/InstallationType";
import TotalsSummary from "./Uniq_SubComp/TotalsSummary";
import ReceiptUpload from "./Uniq_SubComp/ReceiptUpload";
import PaymentTerms from "./Uniq_SubComp/PaymentTerms";
import ProjectChecklist from "./Uniq_SubComp/ProjectChecklist";
import {
  createUniqueSolarProject,
  updateUniqueSolarProject,
  getChecklistItems,
} from "../../../ApiComps/Project/UniqueSolarApi";

const UniqueSolarForm = ({ onBack, onSubmit, initialData, isEdit = false }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    contact_number: "",
    address: "",
    date: new Date().toISOString().split("T")[0],
    valid_until: "",
    project_type: "",
    installation_type: "no_installation",
    tax_percentage: "",
    total_payment: "",
    advance_payment: "",
    completion_payment: "",
    status: "",
    installation_amount: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [products, setProducts] = useState([
    {
      id: Date.now(),
      product_type: "",
      specify_product: "",
      quantity: "",
      unit_price: "",
      line_total: "",
    },
  ]);

  const [checklist, setChecklist] = useState({});
  const [checklistItems, setChecklistItems] = useState([]);
  const [receiptImage, setReceiptImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  // Load checklist items from API and initialize form data
  useEffect(() => {
    const loadChecklistItems = async () => {
      try {
        const items = await getChecklistItems();
        setChecklistItems(items);
        console.log("📋 LOADED CHECKLIST ITEMS:", items);

        // Initialize checklist state with all items as false
        const initialChecklist = {};
        items.forEach((item) => {
          const key = item.item_name.toLowerCase().replace(/\s+/g, "_");
          initialChecklist[key] = false;
        });

        console.log("🔄 INITIAL CHECKLIST STATE:", initialChecklist);

        // ✅ Handle edit mode - if we have initialData with checklist
        if (isEdit && initialData && initialData.checklist) {
          console.log(
            "✏️ EDIT MODE - INITIAL DATA CHECKLIST:",
            initialData.checklist
          );

          if (Array.isArray(initialData.checklist)) {
            // If checklist is an array of selected items
            console.log("📝 CHECKLIST IS ARRAY");
            initialData.checklist.forEach((item) => {
              if (typeof item === "string") {
                if (initialChecklist.hasOwnProperty(item)) {
                  initialChecklist[item] = true;
                  console.log(`✅ CHECKED: ${item}`);
                }
              } else if (item.item_name) {
                const key = item.item_name.toLowerCase().replace(/\s+/g, "_");
                if (initialChecklist.hasOwnProperty(key)) {
                  initialChecklist[key] = true;
                  console.log(`✅ CHECKED: ${key}`);
                }
              }
            });
          } else if (typeof initialData.checklist === "object") {
            // If checklist is an object with key-value pairs
            console.log("📝 CHECKLIST IS OBJECT");
            Object.keys(initialChecklist).forEach((key) => {
              if (initialData.checklist[key] !== undefined) {
                initialChecklist[key] = Boolean(initialData.checklist[key]);
                console.log(
                  `✅ CHECKED: ${key} = ${initialData.checklist[key]}`
                );
              }
            });
          }

          console.log("🎯 FINAL CHECKLIST AFTER MERGE:", initialChecklist);
        }

        setChecklist(initialChecklist);
      } catch (error) {
        console.error("❌ Error loading checklist items:", error);
      }
    };

    loadChecklistItems();
  }, [isEdit, initialData]);

  // Initialize form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        customer_name: initialData.customer_name || "",
        contact_number: initialData.contact_number || "",
        address: initialData.address || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        valid_until: initialData.valid_until || "",
        project_type: initialData.project_type || "",
        installation_type: initialData.installation_type || "no_installation",
        tax_percentage: initialData.tax_percentage || "",
        total_payment:
          initialData.total_payment || initialData.total_amount || "",
        advance_payment: initialData.advance_payment || "",
        completion_payment: initialData.completion_payment || "",
        status: initialData.status || "",
        installation_amount: initialData.installation_amount || "",
      });

      // Set products if available
      if (initialData.products && initialData.products.length > 0) {
        setProducts(
          initialData.products.map((product) => ({
            id: Date.now() + Math.random(),
            product_type: product.product_type || "",
            specify_product: product.specify_product || "",
            quantity: product.quantity || "",
            unit_price: product.unit_price || "",
            line_total: product.line_total || "",
          }))
        );
      }

      // Set receipt image if available
      if (initialData.receipt_image) {
        setReceiptImage(initialData.receipt_image);
      }
    }
  }, [initialData, isEdit]);

  // Add this useEffect for automatic payment calculation
  useEffect(() => {
    const advance = parseFloat(formData.advance_payment) || 0;
    const total = parseFloat(formData.total_payment) || 0;
    const pending = total - advance;

    if (pending !== parseFloat(formData.completion_payment || 0)) {
      setFormData((prev) => ({
        ...prev,
        completion_payment: pending > 0 ? pending.toString() : "0",
      }));
    }
  }, [formData.advance_payment, formData.total_payment]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setApiErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.customer_name.trim())
      errors.customer_name = "This field is required";
    if (!formData.contact_number.trim())
      errors.contact_number = "This field is required";
    if (!formData.address.trim()) errors.address = "This field is required";
    if (!formData.date.trim()) errors.date = "This field is required";
    if (!formData.valid_until.trim())
      errors.valid_until = "This field is required";
    if (!formData.project_type.trim())
      errors.project_type = "This field is required";
    if (!formData.status.trim()) errors.status = "This field is required";
    if (!formData.total_payment.trim())
      errors.total_payment = "This field is required";
    if (!formData.advance_payment.trim())
      errors.advance_payment = "This field is required";

    // Installation type validation
    if (
      formData.installation_type === "standard" ||
      formData.installation_type === "elevated"
    ) {
      if (!formData.installation_amount || formData.installation_amount <= 0) {
        errors.installation_amount = "Installation amount is required";
      }
    }

    // Product validation
    let hasProductErrors = false;
    products.forEach((product, index) => {
      if (!product.product_type.trim()) {
        errors[`products[${product.id}].product_type`] =
          "Product type is required";
        hasProductErrors = true;
      }
      if (
        product.product_type === "Others" &&
        !product.specify_product.trim()
      ) {
        errors[`products[${product.id}].specify_product`] =
          "Please specify the product";
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
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          const updated = { ...product, [field]: value };

          // 🧠 Auto clear product-level error when user types
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [`products[${id}].${field}`]: "",
          }));

          // Recalculate line total
          if (field === "quantity" || field === "unit_price") {
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
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        product_type: "",
        specify_product: "",
        quantity: "",
        unit_price: "",
        line_total: "",
      },
    ]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleChecklistChange = (item) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const subtotal = products.reduce(
    (sum, p) => sum + (parseFloat(p.line_total) || 0),
    0
  );
  const installationCost =
    formData.installation_type !== "no_installation"
      ? parseFloat(formData.installation_amount) || 0
      : 0;
  const taxAmount =
    ((subtotal + installationCost) * parseFloat(formData.tax_percentage || 0)) /
    100;
  const grandTotal = subtotal + installationCost + taxAmount;

  // 🟢 Auto-update Total Payment when Grand Total changes
  useEffect(() => {
    if (grandTotal !== parseFloat(formData.total_payment || 0)) {
      setFormData((prev) => ({
        ...prev,
        total_payment: grandTotal.toFixed(2),
      }));

      // Auto-update completion payment based on new total
      const advance = parseFloat(formData.advance_payment) || 0;
      const newPending = grandTotal - advance;
      setFormData((prev) => ({
        ...prev,
        completion_payment: newPending > 0 ? newPending.toFixed(2) : "0.00",
      }));
    }
  }, [grandTotal]);

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
    const firstErrorField = Object.keys(errors)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
    return;
  }

  setIsSubmitting(true);

     try {
    // ✅ CORRECT CHECKLIST FORMAT FOR BACKEND
    const selectedChecklistItems = Object.keys(checklist).filter(key => checklist[key]);
    
    // Get checklist item IDs from checklistItems
    const checklistIds = selectedChecklistItems.map(checklistKey => {
      const checklistItem = checklistItems.find(item => 
        item.item_name.toLowerCase().replace(/\s+/g, "_") === checklistKey
      );
      return checklistItem ? checklistItem.id : null;
    }).filter(id => id !== null);

    console.log('✅ SELECTED CHECKLIST ITEMS:', selectedChecklistItems);
    console.log('✅ CHECKLIST IDs FOR BACKEND:', checklistIds);

    // ✅ Prepare formatted data for API
      const apiData = {
        customer_name: formData.customer_name,
        contact_number: formData.contact_number.toString(),
        address: formData.address,
        date: formData.date,
        valid_until: formData.valid_until,
        project_type: formData.project_type,
        installation_type: formData.installation_type,
        tax_percentage: formData.tax_percentage || "0.00",
        advance_payment: formData.advance_payment || "0.00",
        total_payment: grandTotal.toFixed(2),
        completion_payment: (
          grandTotal - (parseFloat(formData.advance_payment) || 0)
        ).toFixed(2),
        status: formData.status,

        // 🧾 Products array
        products: products.map((product, index) => ({
          product_type: product.product_type,
          specify_product: product.specify_product || "",
          quantity: product.quantity.toString(),
          unit_price: product.unit_price.toString(),
          line_total: product.line_total.toString(),
          order: index + 1,
        })),

        // ✅ CORRECT: Send checklist_ids as array of integers
      checklist_ids: checklistIds, // ✅ Backend expects this field name
    };

      // 🏗 Add installation amount if applicable
      if (
        formData.installation_type !== "no_installation" &&
        formData.installation_amount
      ) {
        apiData.installation_amount = formData.installation_amount.toString();
      }

      // 🧾 Attach receipt image if uploaded
      if (receiptImage) {
        apiData.receipt_image = receiptImage;
      }

      console.log("📤 SUBMITTING DATA TO API:", apiData);

      let response;
      if (isEdit && initialData && initialData.project_id) {
        // ✅ Use clean project_id directly (no prefix stripping)
        const projectId = initialData.project_id;
        console.log("🔄 UPDATING PROJECT WITH ID:", projectId);
        response = await updateUniqueSolarProject(projectId, apiData);
      } else {
        console.log("🆕 CREATING NEW PROJECT");
        response = await createUniqueSolarProject(apiData);
      }

      // 🟢 Notify parent component if provided
      if (onSubmit) {
        onSubmit(response);
      }

      alert(`Project ${isEdit ? "updated" : "created"} successfully!`);
    } catch (error) {
      console.error("❌ Error submitting form:", error);

      if (error.message?.includes("Validation failed:")) {
        setApiErrors({ general: error.message });
      } else {
        let errorMessage = `Error ${
          isEdit ? "updating" : "creating"
        } project. Please try again.`;

        if (error.response) {
          // Extract field-specific API validation errors
          const apiErrorData = error.response.data || {};
          const fieldErrors = {};

          Object.keys(apiErrorData).forEach((field) => {
            fieldErrors[field] = Array.isArray(apiErrorData[field])
              ? apiErrorData[field].join(", ")
              : apiErrorData[field];
          });

          setApiErrors(fieldErrors);
          errorMessage = "Please check the form for highlighted errors.";
        } else if (error.request) {
          errorMessage =
            "No response from server. Please check your connection.";
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
          <h2 className="text-xl font-semibold">
            {isEdit
              ? "EDIT UNIQUE SOLAR PROJECT"
              : "UNIQUE SOLAR PROJECT ENTRY"}
          </h2>
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
              formErrors={{ ...formErrors, ...apiErrors }}
            />
            <ProductDetails
              products={products}
              handleProductChange={handleProductChange}
              addProduct={addProduct}
              removeProduct={removeProduct}
              formErrors={{ ...formErrors, ...apiErrors }}
            />
            <InstallationType
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={{ ...formErrors, ...apiErrors }}
            />
            <TotalsSummary
              subtotal={subtotal}
              installationCost={installationCost}
              formData={formData}
              handleInputChange={handleInputChange}
              grandTotal={grandTotal}
            />
            <ReceiptUpload
              handleReceiptUpload={handleReceiptUpload}
              receiptImage={receiptImage}
            />
            <PaymentTerms
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={{ ...formErrors, ...apiErrors }}
            />
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
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Project"
                  : "Save Project"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniqueSolarForm;
