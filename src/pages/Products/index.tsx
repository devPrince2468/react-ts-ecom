import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaShoppingCart } from "react-icons/fa";
import "./Products.scss";
import { RootState, store } from "../../redux/store";
import { getProducts } from "../../redux/Slices/products/productThunks";
import AddEditProductModal from "../../components/AddEditProductModal.tsx";
import { addCartItem } from "../../redux/Slices/cart/cartThunks.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
  stock: number;
  reserved: number;
  available: number;
  category: string;
}

const Products = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
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
            (acc: { [key: string]: number }, product: Product) => {
              acc[product.id] = product.available > 0 ? 1 : 0;
              return acc;
            },
            {}
          );
          console.log("Initial quantities:", initialQuantities);
          setQuantities(initialQuantities);
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

  const handleIncrement = (productId: string) => {
    const product = productsData.find((p) => p.id === productId);
    if (!product) return;

    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 0;
      if (currentQuantity >= product.available) {
        toast.warn(`Only ${product.available} items available in stock!`);
        return prev;
      }
      return {
        ...prev,
        [productId]: currentQuantity + 1,
      };
    });
  };

  const handleDecrement = (productId: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 1;
      if (currentQuantity <= 1) {
        toast.info("Quantity cannot be less than 1.");
        return prev;
      }
      return {
        ...prev,
        [productId]: currentQuantity - 1,
      };
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    if (!quantities[product.id] || quantities[product.id] === 0) {
      toast.error("Please select a valid quantity.");
      return;
    }

    if (quantities[product.id] > product.available) {
      toast.error(`Only ${product.available} items available in stock!`);
      return;
    }

    dispatch(
      addCartItem({
        productId: product.id,
        quantity: quantities[product.id],
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("Product added to cart successfully:", res.payload);
        toast.success("Product added to cart successfully!");
        const updatedProducts = productsData.map((p) =>
          p.id === product.id ? { ...p, quantity: quantities[product.id] } : p
        );
        setProductsData(updatedProducts);
      } else {
        console.error("Failed to add product to cart:", res);
      }
    });
  };

  const handleModalSuccess = (isSuccessful: boolean): boolean => {
    if (!isSuccessful) return false;
    setIsModalOpen(false);
    setEditProduct(null);
    dispatch(getProducts()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("Products updated successfully:", res.payload);
        const newProductsData = res.payload.data;
        setProductsData(newProductsData);

        const initialQuantities = newProductsData.reduce(
          (acc: { [key: string]: number }, product: Product) => {
            acc[product.id] = product.available > 0 ? 1 : 0;
            return acc;
          },
          {}
        );
        setQuantities(initialQuantities);
        console.log("Quantities re-initialized:", initialQuantities);

        toast.success("Product list updated successfully!");
      } else {
        console.error("Failed to fetch updated products:", res);
        toast.error("Failed to update product list.");
      }
    });
    return true;
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Products Collection</h1>
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
          <button
            onClick={() => {
              navigate("/cart");
            }}
            className="btn btn-cart"
          >
            <FaShoppingCart />
            <span>Cart</span>
          </button>
          <button
            onClick={() => {
              navigate("/profile");
            }}
            className="btn btn-cart"
          >
            <span>Profile</span>
          </button>
        </div>
      </div>

      {paginatedProducts && paginatedProducts.length > 0 ? (
        <div className="products-grid">
          {paginatedProducts.map((product: Product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                />
                <button
                  onClick={() => handleEditProduct(product)}
                  className="edit-button"
                  aria-label="Edit product"
                >
                  <FaEdit />
                </button>
              </div>
              <div className="product-content">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-price">{product.price}</div>
                <div className="product-availability">
                  {product.available > 0
                    ? `Available: ${product.available}`
                    : "Out of stock"}
                </div>

                <div className="product-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleDecrement(product.id)}
                      className="quantity-btn"
                      aria-label="Decrease quantity"
                      disabled={product.available === 0}
                    >
                      -
                    </button>
                    <span className="quantity-value">
                      {quantities[product.id] || 0}
                    </span>
                    <button
                      onClick={() => handleIncrement(product.id)}
                      className="quantity-btn"
                      aria-label="Increase quantity"
                      disabled={product.available === 0}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="add-to-cart-btn"
                    disabled={product.available === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products-found">
          <p>No products found. Check back later or add new products!</p>
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

export default Products;
