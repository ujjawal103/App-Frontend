import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
import MenuItemCard from "../components/MenuItemCard";
import CartDrawer from "../components/CartDrawer";
import axios from "axios";
import { useParams } from "react-router-dom";

const Menu = ({ restaurantName = "Demo sweets" }) => {
  const { storeId, tableId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [store, setStore] = useState({});

  useEffect(() => {
    fetchMenu();
  }, [storeId]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}items/menu/${storeId}`
      );

      setStore(data.store);

      // store all items, both available and unavailable
      setMenuItems(data.items);

      // by default: show only available ones
      const available = data.items.filter(
        (item) =>
          item.available && item.variants.some((v) => v.available === true)
      );
      setFilteredItems(available);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // 🔹 If empty search, show only available items again
    if (term === "") {
      const available = menuItems.filter(
        (item) =>
          item.available && item.variants.some((v) => v.available === true)
      );
      return setFilteredItems(available);
    }

    // 🔹 Otherwise, show ALL matching items (even unavailable)
    const matched = menuItems.filter((item) =>
      item.itemName.toLowerCase().includes(term)
    );

    setFilteredItems(matched);
  };

  const addToCart = (item, variant) => {
    if (!item.available || !variant.available)
      return toast.error("This item is unavailable");

    const existing = cart.find(
      (c) => c.itemId === item._id && c.variant === variant.name
    );

    let updatedCart;
    if (existing) {
      updatedCart = cart.map((c) =>
        c.itemId === item._id && c.variant === variant.name
          ? { ...c, quantity: c.quantity + 1 }
          : c
      );
    } else {
      updatedCart = [
        ...cart,
        {
          itemId: item._id,
          itemName: item.itemName,
          variant: variant.name,
          price: variant.price,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);
    toast.success("Added to cart");
  };

  const updateQuantity = (itemId, variantName, change) => {
    setCart((prev) => {
      const updated = prev
        .map((c) => {
          if (c.itemId === itemId && c.variant === variantName) {
            const newQuantity = c.quantity + change;
            return { ...c, quantity: Math.max(0, newQuantity) };
          }
          return c;
        })
        .filter((c) => c.quantity > 0);
      return updated;
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 pb-28 min-h-[100vh] bg-gray-200">
      {/* Navbar */}
      <h1 className="text-2xl font-bold text-center mb-2">
        {store.storeName || restaurantName}
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search items..."
        className="w-full p-2 rounded-md border mb-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Menu List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">No items found</p>
        ) : (
          filteredItems.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
              cart={cart}
            />
          ))
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        setOpen={setCartOpen}
        cart={cart}
        setCart={setCart}
        storeId={storeId}
        tableId={tableId}
        store={store}
      />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
        >
          View Cart ({new Set(cart.map((i) => i.itemId)).size})
        </button>
      )}
    </div>
  );
};

export default Menu;
