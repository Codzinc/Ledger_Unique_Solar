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
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState({});
  useEffect(() => {
    const loadChecklistItems = async () => {
      try {
        const items = await getChecklistItems();
        setChecklistItems(items);
        const initialChecklist = {};
        items.forEach((item) => {
          const key = item.item_name.toLowerCase().replace(/\s+/g, "_");
          initialChecklist[key] = false;
        });

        if (isEdit && initialData && initialData.checklist) {
          if (Array.isArray(initialData.checklist)) {
            initialData.checklist.forEach((item) => {
              if (typeof item === "string") {
                if (initialChecklist.hasOwnProperty(item)) {
                  initialChecklist[item] = true;
                }
              } else if (item.item_name) {
                const key = item.item_name.toLowerCase().replace(/\s+/g, "_");
                if (initialChecklist.hasOwnProperty(key)) {
                  initialChecklist[key] = true;
                }
              }
            });
          } else if (typeof initialData.checklist === "object") {
            Object.keys(initialChecklist).forEach((key) => {
              if (initialData.checklist[key] !== undefined) {
                initialChecklist[key] = Boolean(initialData.checklist[key]);
              }
            });
          }
        }

        setChecklist(initialChecklist);
      } catch (error) {
        console.error("❌ Error loading checklist items:", error);
      }
    };

    loadChecklistItems();
  }, [isEdit, initialData]);

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

      if (initialData.images && initialData.images.length > 0) {
        setImages(initialData.images);
      } else {
        setImages([]);
      }
    }
  }, [initialData, isEdit]);

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

    if (
      formData.installation_type === "standard" ||
      formData.installation_type === "elevated"
    ) {
      if (
        !formData.installation_amount ||
        parseFloat(formData.installation_amount) <= 0
      ) {
        errors.installation_amount = "Installation amount is required";
      }
    }

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

          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [`products[${id}].${field}`]: "",
          }));

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
    formData.installation_type === "standard" ||
    formData.installation_type === "elevated"
      ? parseFloat(formData.installation_amount) || 0
      : 0;
  const taxAmount =
    ((subtotal + installationCost) * parseFloat(formData.tax_percentage || 0)) /
    100;
  const grandTotal = subtotal + installationCost + taxAmount;

  useEffect(() => {
    if (grandTotal !== parseFloat(formData.total_payment || 0)) {
      setFormData((prev) => ({
        ...prev,
        total_payment: grandTotal.toFixed(2),
      }));
      const advance = parseFloat(formData.advance_payment) || 0;
      const newPending = grandTotal - advance;
      setFormData((prev) => ({
        ...prev,
        completion_payment: newPending > 0 ? newPending.toFixed(2) : "0.00",
      }));
    }
  }, [grandTotal]);

  const handleReceiptUpload = (files) => {
    if (files && files.length > 0) {
      const filesArray = files instanceof FileList ? Array.from(files) : files;
      if (images.length + filesArray.length > 7) {
        setFormErrors((prev) => ({
          ...prev,
          images: "Maximum 7 images allowed per project",
        }));
        return;
      }

      const validFiles = filesArray.filter((file) => {
        if (!file.type.startsWith("image/")) {
          setFormErrors((prev) => ({
            ...prev,
            images: "Please select only image files",
          }));
          return false;
        }
        return true;
      });

      setImages((prev) => [...prev, ...validFiles]);
      setFormErrors((prev) => ({ ...prev, images: "" }));
    } else if (Array.isArray(files)) {
      setImages(files);
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

    let selectedChecklistItems, checklistIds, checklistIdsAsIntegers;

    try {
      const submitFormData = new FormData();

      selectedChecklistItems = Object.keys(checklist).filter(
        (key) => checklist[key]
      );

      checklistIds = selectedChecklistItems
        .map((checklistKey) => {
          const checklistItem = checklistItems.find(
            (item) =>
              item.item_name.toLowerCase().replace(/\s+/g, "_") === checklistKey
          );
          return checklistItem ? checklistItem.id : null;
        })
        .filter((id) => id !== null);

      checklistIdsAsIntegers = checklistIds.map((id) => parseInt(id, 10));

      submitFormData.append("customer_name", formData.customer_name);
      submitFormData.append(
        "contact_number",
        formData.contact_number ? formData.contact_number.toString() : ""
      );
      submitFormData.append("address", formData.address);
      submitFormData.append("date", formData.date);
      submitFormData.append("valid_until", formData.valid_until);
      submitFormData.append("project_type", formData.project_type);
      submitFormData.append("installation_type", formData.installation_type);
      submitFormData.append(
        "tax_percentage",
        formData.tax_percentage || "0.00"
      );
      submitFormData.append(
        "advance_payment",
        formData.advance_payment || "0.00"
      );
      submitFormData.append("total_payment", grandTotal.toFixed(2));
      submitFormData.append("grand_total", grandTotal.toFixed(2));
      submitFormData.append("subtotal", subtotal.toFixed(2));
      submitFormData.append(
        "completion_payment",
        (grandTotal - (parseFloat(formData.advance_payment) || 0)).toFixed(2)
      );
      submitFormData.append("status", formData.status);

      if (
        formData.installation_type === "standard" ||
        formData.installation_type === "elevated"
      ) {
        submitFormData.append(
          "installation_amount",
          formData.installation_amount.toString()
        );
      }

      const productsData = products.map((product, index) => ({
        product_type: product.product_type,
        specify_product: product.specify_product || "",
        quantity: product.quantity.toString(),
        unit_price: product.unit_price.toString(),
        line_total: product.line_total.toString(),
        order: index + 1,
      }));

      submitFormData.append("products", JSON.stringify(productsData));

      checklistIdsAsIntegers.forEach((id) => {
        submitFormData.append("checklist_ids", id.toString());
      });

      let newImageCount = 0;
      images.forEach((image) => {
        if (image instanceof File) {
          submitFormData.append("images", image);
          newImageCount++;
        }
      });

      let response;
      if (isEdit && initialData && initialData.project_id) {
        const projectId = initialData.project_id;
        response = await updateUniqueSolarProject(projectId, submitFormData);
      } else {
        response = await createUniqueSolarProject(submitFormData);
      }

      if (onSubmit) {
        onSubmit(response);
      }

      alert(`Project ${isEdit ? "updated" : "created"} successfully!`);
    } catch (error) {
      if (error.response?.data?.error?.includes("Checklist IDs")) {
        alert("Checklist selection error. Please review your selections.");
      } else {
        alert("Something went wrong while submitting the form.");
      }

      let errorMessage = `Error ${
        isEdit ? "updating" : "creating"
      } project. Please try again.`;

      if (error.response) {
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
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      setApiErrors({ general: errorMessage });
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
              images={images}
              formErrors={{ ...formErrors, ...apiErrors }}
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
