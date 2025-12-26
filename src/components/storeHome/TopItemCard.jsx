const TopItemCard = ({ item, rank }) => {
  return (
    <div className="relative bg-yellow-50 border-2 border-pink-600 rounded-xl shadow overflow-hidden">

      {/* ITEM IMAGE */}
      <div className="h-28 md:h-50 w-full bg-gray-100 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.itemName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* ORDERS ROW */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <span className="text-sm font-bold text-gray-600">{item.itemName}</span>

        <div className="w-14 h-14 p-4 rounded-full bg-pink-600 text-white flex flex-col items-center justify-center text-sm font-bold">
          {item.orders} <p className="text-[0.5rem] block">Orders</p>
        </div>
      </div>

      {/* RANK */}
      <div className="flex items-center justify-center py-1 border-t">
        <div
          className={`w-14 h-14 flex items-center justify-center text-2xl font-extrabold text-black ${
            rank === 1
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
        >
          {rank}
        </div>
      </div>
    </div>
  );
};

export default TopItemCard;
