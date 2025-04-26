import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";

import "./Products.scss";
import { RootState, store } from "../../redux/store";
import { getProducts } from "../../redux/Slices/products/productThunks";

const Products = () => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const dispatch = useDispatch<typeof store.dispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const itemsPerPage = 6;

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(getProducts()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          console.log("Products fetched successfully:", res.payload);
          setProductsData(res.payload.data);
          const initialQuantities = res.payload.data.reduce(
            (acc: any, product: any) => {
              acc[product.id] = product.quantity || 1; // Use product.quantity if available, default to 1
              return acc;
            },
            {}
          );
          setQuantities(initialQuantities);
        } else {
          console.error("Failed to fetch products:", res);
        }
      });
      hasFetched.current = true;
    }
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPages = Math.ceil(productsData?.length / itemsPerPage);
  const paginatedProducts = productsData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleIncrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] > 1 ? prev[productId] - 1 : 1,
    }));
  };

  const handleEditProduct = (product: any) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="home">
      <div className="header-container">
        <h1>Welcome to Products Page</h1>
        <button
          onClick={() => {
            setEditProduct(null);
            setIsModalOpen(true);
          }}
          className="add-product-btn"
        >
          Add Product
        </button>
      </div>
      <div className="card-container">
        {paginatedProducts &&
          paginatedProducts.map((product: any) => (
            <div key={product.id} className="card">
              <img src={product.image} alt={product.title} />
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <div className="quantity-controls">
                <button
                  onClick={() => handleDecrement(product.id)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span>{quantities[product.id]}</span>
                <button
                  onClick={() => handleIncrement(product.id)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleEditProduct(product)}
                className="edit-btn"
              >
                <FaEdit />
              </button>
            </div>
          ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <AddEditProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditProduct(null);
        }}
        product={editProduct}
      />
    </div>
  );
};

const AddEditProductModal = ({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}) => {
  const [productName, setProductName] = useState(product ? product.title : "");
  const [imageUrl, setImageUrl] = useState(product ? product.image : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [price, setPrice] = useState(product ? product.price.toString() : "");
  const [quantity, setQuantity] = useState(product ? product.quantity || 1 : 1);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    product ? product.image : null
  );

  useEffect(() => {
    if (product) {
      setProductName(product.title);
      setImageUrl(product.image);
      setDescription(product.description);
      setPrice(product.price.toString());
      setQuantity(product.quantity || 1);
      setPreviewImage(product.image);
    } else {
      setProductName("");
      setImageUrl("");
      setDescription("");
      setPrice("");
      setQuantity(1);
      setPreviewImage(null);
      setNewImage(null);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct = {
      id: product ? product.id : Date.now().toString(),
      title: productName,
      image: newImage ? previewImage : imageUrl,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity.toString(), 10), // Ensure quantity is an integer
    };
    console.log("Submitted Product:", updatedProduct);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            className="border w-full p-2 mb-4 rounded"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <label className="block mb-2 font-medium">Image</label>
          {previewImage && (
            <div className="mb-4">
              <img
                src={previewImage}
                alt="Product Preview"
                className="w-32 h-32 object-cover mb-2"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="border w-full p-2 mb-4 rounded"
            onChange={handleImageChange}
          />
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            placeholder="Description"
            className="border w-full p-2 mb-4 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            className="border w-full p-2 mb-4 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
          <label className="block mb-2 font-medium">Quantity</label>
          <input
            type="number"
            placeholder="Quantity"
            className="border w-full p-2 mb-4 rounded"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} // Ensure valid integer, default to 1
            required
            min="1"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;
