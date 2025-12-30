import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
import MenuItemCard from "../components/MenuItemCard";
import CartDrawer from "../components/CartDrawer";
import CategoryFilterQRBar from "../components/CategoryFilterQRBar";
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
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");


  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, [storeId]);


  const fetchCategories = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}categories/${storeId}`
    );
    setCategories(res.data.categories || []);
  } catch (err) {
    toast.error("Failed to load categories");
  }
};

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


  useEffect(() => {
  let data = menuItems;

  // ✅ CATEGORY FILTER
  if (activeCategory !== "all") {
    data = data.filter((item) => {
      if (typeof item.categoryId === "string") {
        return item.categoryId === activeCategory;
      }
      return item.categoryId?._id === activeCategory;
    });
  }

  // ✅ SEARCH BY ITEM NAME OR CATEGORY NAME
  if (searchTerm.trim()) {
    data = data.filter((item) => {
      const itemNameMatch = item.itemName
        .toLowerCase()
        .includes(searchTerm);

      const categoryNameMatch = item.categoryId?.name
        ?.toLowerCase()
        .includes(searchTerm);

      return itemNameMatch || categoryNameMatch;
    });
  }

  // ✅ CUSTOMER RULE: only show available items unless searching
  if (!searchTerm.trim()) {
    data = data.filter(
      (item) =>
        item.available &&
        item.variants.some((v) => v.available === true)
    );
  }

  setFilteredItems(data);
}, [menuItems, activeCategory, searchTerm]);


const handleSearch = (e) => {
  setSearchTerm(e.target.value.toLowerCase());
};


  if (loading) return <Loading />;

  return (
    <div className="pb-28 min-h-[100vh] bg-gray-200">
      {/* Navbar */}
      <h1 className="text-2xl font-bold text-center mb-2 px-4 pt-4">
        {store.storeName || restaurantName}
      </h1>

      {/* Search Bar */}
      <div className="px-4">
        <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search items by name or category..."
        className="w-full p-2 rounded-md border border-gray-700 mb-4 outline-none focus:ring-1 focus:border-0 focus:ring-pink-700"
      />
      </div>

      {/* Category Filter */}
      <CategoryFilterQRBar
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Menu List */}
      <div className="px-4">
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
          className="fixed bottom-5 right-5 bg-pink-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
        >
          View Cart ({new Set(cart.map((i) => i.itemId)).size})
        </button>
      )}
    </div>
  );
};

export default Menu;
