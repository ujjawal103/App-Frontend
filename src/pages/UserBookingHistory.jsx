// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaUser,
//   FaCut,
//   FaDollarSign,
//   FaSearch,
// } from "react-icons/fa";
// import Loading from "../components/Loading";
// import FooterNav from "../components/FooterNav";
// import { UserDataContext } from "../context/AdminContext";
// import toast from "react-hot-toast";


// const UserBookingHistory = () => {
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message , setMessage] = useState("");
//   const [searchId, setSearchId] = useState("");
//   const { user } = useContext(UserDataContext);

//   const token = localStorage.getItem("token"); // assuming token stored here

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}bookings/user/bookings`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (response.data.success) {
//           setBookings(response.data.bookings);
//           setFilteredBookings(response.data.bookings);
//         }
//       } catch (err) {
//              const message = err.response?.data?.message || "Something went wrong !";
//              toast.error(message);
//      } finally {
//         setLoading(false);
//         setMessage("");
//       }
//     };

//     fetchBookings();
//   }, []);

//   // Filter whenever searchId changes
//   useEffect(() => {
//     if (!searchId.trim()) {
//       setFilteredBookings(bookings);
//     } else {
//       const results = bookings.filter((b) =>
//         b._id.toLowerCase().includes(searchId.toLowerCase())
//       );
//       setFilteredBookings(results);
//     }
//   }, [searchId, bookings]);

//   // ✅ Function to check if booking is past or future
//   const isPastBooking = (dateStr, timeStr) => {
//     try {
//       const [startTime] = timeStr.split("-"); // e.g. "13:00"
//       const bookingDateTime = new Date(`${dateStr}T${startTime}:00`); // date+time
//       return bookingDateTime < new Date();
//     } catch {
//       return false;
//     }
//   };

//   // ✅ Function executed on cancel
//    const handleCancel = async(bookingId) => {
//     setLoading(true);
//     setMessage("Cancelling slot...");
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}bookings/cancel/${bookingId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         window.location.reload(true);
//         toast.success("Slot cancelled successfully ✅");
//       }
//     } catch (err) {
//       const message = err.response?.data?.message || "Something went wrong !";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//       setMessage("");
//       setSelectedSlot(null);
//     }
//   };

//   if (loading) {
//     return <Loading message={message} />;
//   }

//   return (
//     <div className="p-6 mb-12">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         📖 Booking History
//       </h2>

//       {/* 🔍 Search Bar */}
//       <div className="flex items-center gap-3 mb-6 bg-white shadow-sm border rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
//         <FaSearch className="text-gray-400 text-lg" />
//         <input
//           type="text"
//           placeholder="Search by Booking ID..."
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//           className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
//         />
//       </div>

//       {filteredBookings.length === 0 ? (
//         <p className="text-gray-500">No bookings found.</p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2">
//           {filteredBookings.map((booking) => {
//             const past = isPastBooking(booking.date, booking.time);

//             return (
//               <div
//                 key={booking._id}
//                 className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition flex flex-col justify-between"
//               >
//                 <div>
//                   <div className="flex items-center justify-between mb-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         booking.status === "booked"
//                           ? "bg-green-100 text-green-700"
//                           : booking.status === "cancelled"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {booking.status.toUpperCase()}
//                     </span>
//                     <span className="text-gray-400 text-xs">
//                       {new Date(booking.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2 text-gray-700">
//                       <FaUser className="text-blue-500" />
//                       <span>{user.email || "You"}</span>
//                     </div>

//                     <div className="flex items-center gap-2 text-gray-700">
//                       <FaCut className="text-purple-500" />
//                       <span>
//                         {booking.barberId?.name || "No Barber Assigned"}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-2 text-gray-700">
//                       <FaCalendarAlt className="text-pink-500" />
//                       <span>{booking.date}</span>
//                     </div>

//                     <div className="flex items-center gap-2 text-gray-700">
//                       <FaClock className="text-yellow-500" />
//                       <span>{booking.time}</span>
//                     </div>

//                     <div className="flex items-center gap-2 text-gray-700">
//                       <FaDollarSign className="text-green-500" />
//                       <span>{booking.price} ₹</span>
//                     </div>

//                     <div className="flex items-center gap-2 text-gray-700">
//                       <span>Booking ID : {booking._id}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ✅ Buttons */}
//                 {booking.status === "booked" && (
//                   <div className="flex justify-end mt-4">
//                     {past ? (
//                       <button
//                         className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700"
//                       >
//                         Completed
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleCancel(booking._id)}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                       >
//                         Cancel Slot
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//       <FooterNav />
//     </div>
//   );
// };

// export default UserBookingHistory;
