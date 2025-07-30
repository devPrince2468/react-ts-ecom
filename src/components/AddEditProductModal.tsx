"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, store } from "../redux/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addProduct,
  updateProduct,
} from "../redux/Slices/products/productThunks";
import "../styles/AddEditProductModal.scss";
import {
  FaTimes as X,
  FaUpload as Upload,
  FaDollarSign as DollarSign,
  FaTag as Tag,
  FaBox as Box,
  FaFileAlt as FileText,
  FaFont as Type,
  FaLock as Lock,
} from "react-icons/fa";

interface Product {
  id?: string;
  title: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  reserved: number;
  available?: number;
  category: string;
}

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess?: (isSuccessful: boolean) => boolean;
}

const AddEditProductModal = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}: AddEditProductModalProps) => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { loading } = useSelector((state: RootState) => state.products);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: 1,
    reserved: 0,
    category: "",
    imageUrl: "",
    newImage: null as File | null,
    previewImage: null as string | null,
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock,
        reserved: product.reserved,
        category: product.category,
        imageUrl: product.image,
        newImage: null,
        previewImage: product.image,
      });
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      stock: 1,
      reserved: 0,
      category: "",
      imageUrl: "",
      newImage: null,
      previewImage: null,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        previewImage: reader.result as string,
        newImage: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "stock" || name === "reserved"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      title,
      description,
      price,
      stock,
      reserved,
      category,
      newImage,
      imageUrl,
    } = form;

    if (!title || !description || !price || stock === undefined || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock.toString());
    formData.append("reserved", reserved.toString());
    formData.append("category", category);

    if (newImage) {
      formData.append("file", newImage);
    } else {
      formData.append("image", imageUrl);
    }

    try {
      if (product?.id) {
        await dispatch(updateProduct({ id: product.id, formData }));
        toast.success("Product updated successfully");
        onSuccess?.(true);
      } else {
        if (!newImage) {
          toast.error("Please upload an image");
          return;
        }
        const res = await dispatch(addProduct(formData));
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Product added successfully");
          onSuccess?.(true);
        } else {
          toast.error("Failed to add product");
          onSuccess?.(false);
        }
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      onSuccess?.(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div
        className="product-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-modal-header">
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>
          <button
            onClick={onClose}
            className="product-modal-close"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-modal-form">
          {/* Details Section */}
          <div className="product-modal-section">
            <h3>Details</h3>
            <div className="form-group">
              <label htmlFor="title">
                <Type className="form-icon" />
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">
                <Tag className="form-icon" />
                Category <span className="required">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter product category"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <FileText className="form-icon" />
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="product-modal-section">
            <h3>Media</h3>
            <div className="form-group image-upload-container">
              <label>
                <Upload className="form-icon" />
                Product Image <span className="required">*</span>
              </label>
              <div className="image-upload-area">
                {form.previewImage ? (
                  <div className="image-preview-container">
                    <img
                      src={form.previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          previewImage: null,
                          newImage: null,
                        }))
                      }
                    >
                      <X />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload className="upload-icon" />
                    <p>Drag & drop or click to upload</p>
                    <span>Supports JPG, PNG, GIF up to 5MB</span>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Section */}
          <div className="product-modal-section">
            <h3>Pricing & Inventory</h3>
            <div className="form-group">
              <label htmlFor="price">
                <DollarSign className="form-icon" />
                Price <span className="required">*</span>
              </label>
              <div className="price-input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                <Box className="form-icon" />
                Stock Quantity <span className="required">*</span>
              </label>
              <div className="quantity-input-group">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      stock: Math.max(0, prev.stock - 1),
                    }))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      stock: prev.stock + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reserved">
                <Lock className="form-icon" />
                Reserved Quantity
              </label>
              <div className="quantity-input-group">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      reserved: Math.max(0, prev.reserved - 1),
                    }))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  id="reserved"
                  name="reserved"
                  value={form.reserved}
                  onChange={handleChange}
                  min="0"
                />
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      reserved: prev.reserved + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
              <p className="help-text">
                Available: {Math.max(0, form.stock - form.reserved)}
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="product-modal-actions">
            <div className="button-group">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? "Saving..."
                  : product
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProductModal;
