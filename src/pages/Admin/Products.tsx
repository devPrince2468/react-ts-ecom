import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import "./AdminPanel.scss";
import { RootState, store } from "../../redux/store";
import { getProducts } from "../../redux/Slices/products/productThunks";
import AddEditProductModal from "../../components/AddEditProductModal.tsx";
import { toast } from "react-toastify";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  reserved: number;
  available: number;
  category: string;
}

const AdminProducts = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const dispatch = useDispatch<typeof store.dispatch>();
  const { loading, error } = useSelector((state: RootState) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const itemsPerPage = 10;

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(getProducts()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setProductsData(res.payload);
        } else {
          console.error("Failed to fetch products:", res);
        }
      });
      hasFetched.current = true;
    }
  }, [dispatch]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  const totalPages = Math.ceil(productsData?.length / itemsPerPage);
  const paginatedProducts = productsData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (isSuccessful: boolean): boolean => {
    if (!isSuccessful) return false;
    setIsModalOpen(false);
    setEditProduct(null);
    dispatch(getProducts()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const newProductsData = res.payload.data;
        setProductsData(newProductsData);
        toast.success("Product list updated successfully!");
      } else {
        console.error("Failed to fetch updated products:", res);
        toast.error("Failed to update product list.");
      }
    });
    return true;
  };

  return (
    <div className="products-page admin-products-table-view">
      <div className="products-header">
        <h1>Manage Products</h1>
        <div className="header-actions">
          <button
            onClick={() => {
              setEditProduct(null);
              setIsModalOpen(true);
            }}
            className="btn btn-add"
          >
            Add Product
          </button>
        </div>
      </div>

      {paginatedProducts && paginatedProducts.length > 0 ? (
        <div className="table-responsive-container">
          <table className="products-data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product: Product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="product-table-image"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>${product.price || 0}</td>
                  <td>{product.stock}</td>
                  <td>{product.available}</td>
                  <td>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="btn btn-edit"
                      aria-label="Edit product"
                    >
                      <FaEdit /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-products-found">
          <p>No products found. Click "Add Product" to create one.</p>
        </div>
      )}

      {totalPages > 1 && (
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
      )}

      <AddEditProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditProduct(null);
        }}
        product={editProduct}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminProducts;
