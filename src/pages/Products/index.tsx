import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import "./Products.scss";
import { RootState, store } from "../../redux/store";
import { getProducts } from "../../redux/Slices/products/productThunks";
import AddEditProductModal from "../../components/AddEditProductModal.tsx";
import { addCartItem } from "../../redux/Slices/cart/cartThunks.ts";

const Products = () => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const dispatch = useDispatch<typeof store.dispatch>();
  const { loading, error } = useSelector((state: RootState) => state.products);
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
              acc[product.id] = product.quantity || 1;
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

  const handleAddToCart = (product: any) => {
    const updatedProducts = productsData.map((p) =>
      p.id === product.id ? { ...p, quantity: quantities[product.id] } : p
    );
    setProductsData(updatedProducts);
    console.log("Added to cart:", product, "Quantity:", quantities[product.id]);
    dispatch(
      addCartItem({
        productId: product.id,
        quantity: quantities[product.id],
      })
    );
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
              <div className="buttons-container">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="edit-btn"
                >
                  <FaEdit />
                </button>
                <div className="add-to-cart-container">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
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

export default Products;
