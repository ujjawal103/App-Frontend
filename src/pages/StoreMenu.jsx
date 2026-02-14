import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loading from "../components/Loading";
import MenuItemCard from "../components/MenuItemCard";
import StoreCartDrawer from "../components/StoreCartDrawer";
import { StoreDataContext } from "../context/StoreContext";
import FooterNavStore from "../components/FooterNavStore";
import { Capacitor } from "@capacitor/core";
import { getStoreItems } from "../offline/storeItemsDB";
import { getStoreTables } from "../offline/storeTablesDB";
import CategoryFilterQRBar from "../components/CategoryFilterQRBar";
import MenuItemCardSkeleton from "../components/MenuItemCardSkeleton";



const StoreMenu = ({ restaurantName = "Your Menu" }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const {store, setStore} = useContext(StoreDataContext);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const storeId = store?._id; // assume storeId saved after login
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMenu();
    fetchTables();
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

    // ⭐ ONLINE FETCH
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}items/menu/${storeId}`
    );

    const items = data.items || [];

    setMenuItems(items);

    const available = items.filter(
      (item) => item.available && item.variants.some((v) => v.available === true)
    );

    setFilteredItems(available);

  } catch (err) {

    

    // ⭐ OFFLINE FALLBACK
    if (Capacitor.isNativePlatform()) {

      const cached = await getStoreItems();

      if (cached) {

        setMenuItems(cached);

        const available = cached.filter(
          (item) => item.available && item.variants.some((v) => v.available === true)
        );

        setFilteredItems(available);

        return;
      }
    }

    // ⭐ No offline data available
    toast.error("Failed to load menu");
  } finally {
    setLoading(false);
  }
};


const fetchTables = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}tables/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTables(data.tables);

  } catch (error) {

    // ⭐ Offline fallback
    if (Capacitor.isNativePlatform()) {
      const cached = await getStoreTables();

      if (cached) {
        setTables(cached);
        return;
      }
    }

    toast.error("Failed to load tables");
  }
};


  // const handleSearch = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm(term);
  //   if (term === "") {
  //     const available = menuItems.filter(
  //       (item) =>
  //         item.available && item.variants.some((v) => v.available === true)
  //     );
  //     return setFilteredItems(available);
  //   }
  //   const matched = menuItems.filter((item) =>
  //     item.itemName.toLowerCase().includes(term)
  //   );
  //   setFilteredItems(matched);
  // };

  const addToCart = (item, variant) => {
    if (!item.available || !variant.available)
      return toast.error("This item is unavailable");

    const existing = cart.find(
      (c) => c.itemId === item._id && c.variant === variant.name && c.variantId === variant._id
    );
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((c) =>
        c.itemId === item._id && c.variant === variant.name && c.variantId === variant._id
          ? { ...c, quantity: c.quantity + 1 }
          : c
      );
    } else {
      updatedCart = [
        ...cart,
        {
          itemId: item._id,
          itemName: item.itemName,
          variantId: variant._id,
          variant: variant.name,
          price: variant.price,
          quantity: 1,
        },
      ];
    }
    setCart(updatedCart);
  };

  const updateQuantity = (itemId, variantId, variantName, change) => {
    setCart((prev) => {
      const updated = prev
        .map((c) => {
          if (c.itemId === itemId && c.variant === variantName && c.variantId === variantId) {
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

  // if (loading) return <Loading />;

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 min-h-[100vh] bg-gray-200">
      <h1 className="text-2xl font-bold text-center mb-2 break-words px-4 pt-4">
        {store.storeName || restaurantName}
      </h1>

      <div className="px-4">
        <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search items by name or category..."
        className="w-full p-2 rounded-md border mb-4 outline-none focus:ring-1 focus:border-0 focus:ring-pink-700"
      />
      </div>

      {/* Category Filter */}
      <CategoryFilterQRBar
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="px-4 pb-18 md:pb-22">
        <div className="space-y-3">
        {loading ? (
            <>
              {[...Array(6)].map((_, index) => (
                <MenuItemCardSkeleton key={index} />
              ))}
            </>
          ) : filteredItems.length === 0 ? (
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

      <StoreCartDrawer
        open={cartOpen}
        setOpen={setCartOpen}
        cart={cart}
        setCart={setCart}
        storeId={storeId}
        store={store}
        tables={tables}
      />

      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-24 md:bottom-10 right-5 bg-pink-600 text-white px-4 py-2 rounded-full shadow-lg z-10"
        >
          View Cart ({new Set(cart.map((i) => i.itemId)).size})
        </button>
      )}



      <FooterNavStore />
    </div>
  );
};

export default StoreMenu;
