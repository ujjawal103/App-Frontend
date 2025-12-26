import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ open, setOpen, cart, setCart, storeId, tableId, store }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(""); // 👈 new state for username
  const navigate = useNavigate();
  if (!open) return null;

  // --- Helper functions ---
  const updateQuantity = (itemId, variant, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((i) =>
          i.itemId === itemId && i.variant === variant
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const addToCart = (itemId, itemName, variant, price) => {
    setCart((prevCart) => {
      const exists = prevCart.find(
        (i) => i.itemId === itemId && i.variant === variant
      );
      if (exists) {
        return prevCart.map((i) =>
          i.itemId === itemId && i.variant === variant
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prevCart, { itemId, itemName, variant, price, quantity: 1 }];
      }
    });
  };

  const getCartQuantity = (itemId, variant) => {
    const c = cart.find((i) => i.itemId === itemId && i.variant === variant);
    return c?.quantity || 0;
  };

  // --- Group items ---
  const groupedItems = cart.reduce((acc, curr) => {
    if (!acc[curr.itemId]) {
      acc[curr.itemId] = {
        itemId: curr.itemId,
        itemName: curr.itemName,
        variants: [],
      };
    }
    acc[curr.itemId].variants.push({
      type: curr.variant,
      quantity: curr.quantity,
      price: curr.price,
    });
    return acc;
  }, {});
  const groupedArray = Object.values(groupedItems);

  // --- Billing ---
  const subTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gstApplicable = store?.gstSettings?.gstApplicable;
  const gstRate = store?.gstSettings?.gstRate || 0;
  const restaurantChargeApplicable = store?.gstSettings?.restaurantChargeApplicable;
  const restaurantCharge = store?.gstSettings?.restaurantCharge || 0;
  const gstAmount = gstApplicable ? subTotal * gstRate : 0;
  const restaurantChargeAmount = restaurantChargeApplicable ? restaurantCharge : 0;
  const total = subTotal + gstAmount + restaurantChargeAmount;

  // --- Checkout ---
  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}orders/create`,
        {
          storeId,
          tableId,
          username: username.trim() || "Guest", // 👈 send username (optional)
          items: groupedArray,
        }
      );
      toast.success("Order placed successfully");
      navigate("/order-success");
      setCart([]);
      setOpen(false);
      localStorage.setItem("lastOrder", JSON.stringify(data.order));
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 rounded-t-2xl min-h-[100vh] h-full overflow-y-auto z-11">
      <h2 className="font-semibold text-lg mb-3">Your Cart</h2>

      {groupedArray.length === 0 ? (
        <p className="text-gray-500 text-sm">No items added</p>
      ) : (
        <>
          {groupedArray.map((group) => (
            <div key={group.itemId} className="mb-3 border-b pb-2 flex flex-col gap-1">
              <p className="font-medium overflow-hidden">{group.itemName}</p>

              {group.variants.map((v, idx) => (
                <div key={idx} className="flex flex-col text-sm text-gray-700">
                  <div className="flex justify-between items-center">
                    <span>
                      {v.type} — ₹{v.price}
                    </span>

                    <div className="flex items-center gap-2">
                      {!getCartQuantity(group.itemId, v.type) ? (
                        <button
                          onClick={() =>
                            addToCart(group.itemId, group.itemName, v.type, v.price)
                          }
                          className="px-3 py-1 rounded text-sm bg-blue-500 text-white"
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="flex items-center border rounded-md px-2 py-1 bg-gray-50">
                          <button
                            onClick={() =>
                              updateQuantity(group.itemId, v.type, -1)
                            }
                            className="px-2 text-lg font-semibold text-blue-600"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm font-medium">
                            {getCartQuantity(group.itemId, v.type)}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(group.itemId, v.type, +1)
                            }
                            className="px-2 text-lg font-semibold text-blue-600"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Per-item total line */}
                  <div className="text-xs text-gray-500 text-right mt-0.5">
                    ₹{(v.price * getCartQuantity(group.itemId, v.type)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Bill Summary */}
          <div className="mt-4 space-y-1 text-sm font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subTotal.toFixed(2)}</span>
            </div>

            {gstApplicable && (
              <div className="flex justify-between text-gray-700">
                <span>GST ({gstRate * 100}%)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
            )}

            {restaurantChargeApplicable && (
              <div className="flex justify-between text-gray-700">
                <span>Restaurant Charge</span>
                <span>₹{restaurantChargeAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between mt-2 text-base font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* 👇 Optional Username Input */}
          <div className="mt-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name (optional)"
              className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-14"></div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="fixed bottom-2 left-0 ml-[2vw] mr-[2vw] w-[96vw] bg-blue-600 text-white py-2 rounded-md"
          >
            {loading ? "Placing..." : "Place Order"}
          </button>
        </>
      )}

      <button
        onClick={() => setOpen(false)}
        className="absolute top-2 right-4 text-gray-500 text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default CartDrawer;
