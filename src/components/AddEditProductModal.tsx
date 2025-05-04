import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../redux/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addProduct,
  updateProduct,
} from "../redux/Slices/products/productThunks";
import "../styles/AddEditProductModal.scss";

interface Product {
  id?: string;
  title: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess?: (isSuccessful: boolean) => boolean; // Update callback to accept Product or boolean
}

const AddEditProductModal = ({
  isOpen,
  onClose,
  product,
  onSuccess, // Destructure the callback
}: AddEditProductModalProps) => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { loading } = useSelector((state: RootState) => state.products);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: 1,
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
        quantity: product.quantity,
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
      quantity: 1,
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
      [name]: name === "quantity" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      title,
      description,
      price,
      quantity,
      category,
      newImage,
      imageUrl,
    } = form;

    if (!title || !description || !price || !quantity || !category) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity.toString());
    formData.append("category", category);

    if (newImage) {
      formData.append("file", newImage);
    } else {
      formData.append("image", imageUrl);
    }

    try {
      if (product?.id) {
        await dispatch(updateProduct({ id: Number(product.id), formData }));
        toast.success("Product updated successfully");
        onSuccess?.(true); // Notify parent on success
      } else {
        if (!newImage) {
          toast.error("Please upload an image");
          return;
        }
        const res = await dispatch(addProduct(formData));
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Product added successfully");
          onSuccess?.(true); // Notify parent on success
        } else {
          toast.error("Failed to add product");
          onSuccess?.(false); // Notify parent on failure
        }
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      onSuccess?.(false); // Notify parent on failure
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{product ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Product Name</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />

          <label>Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />

          <label>Image</label>
          {form.previewImage && (
            <img
              src={form.previewImage}
              alt="Preview"
              className="image-preview"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            required
          />

          <label>Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            step="0.01"
            min="0"
            required
          />

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            min="1"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
          </button>
        </form>

        <button onClick={onClose} className="close-btn background-red">
          X
        </button>
      </div>
    </div>
  );
};

export default AddEditProductModal;
