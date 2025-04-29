import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import "./Products.scss";
import { RootState, store } from "../../redux/store";
import { getProducts } from "../../redux/Slices/products/productThunks";
import AddEditProductModal from "../../components/AddEditProductModal.tsx";
import {
  addCartItem,
  getCartItems,
} from "../../redux/Slices/cart/cartThunks.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

const Products = () => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [cartData, setCartData] = useState<any[]>([]);
  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.products);
  const cartItems = useSelector(
    (state: RootState) => state.cart?.items?.items || []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const itemsPerPage = 6;

  const hasFetched = useRef(false);

  console.log("cartItems Data:", cartItems);

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

  useEffect(() => {
    dispatch(getCartItems()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("Cart items fetched successfully:", res.payload);
        const transformedItems = res.payload.items.map((item: any) => ({
          id: item.product.id,
          name: item.product.title,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
        }));
        setCartData(transformedItems);
      } else {
        console.error("Failed to fetch cart items:", res);
      }
    });
  }, []);

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

  const handleAddToCart = (product: Product) => {
    if (!quantities[product.id]) {
      console.error("Invalid quantity for product:", product);
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
        <button
          onClick={() => {
            navigate("/cart");
          }}
          className="add-product-btn"
        >
          Cart
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
