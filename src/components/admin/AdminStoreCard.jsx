const COLOR_THEMES = [
  {
    bg: "bg-gradient-to-br from-slate-50 to-slate-100",
    ring: "ring-slate-200",
  },
  {
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    ring: "ring-indigo-200",
  },
  {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    ring: "ring-emerald-200",
  },
  {
    bg: "bg-gradient-to-br from-rose-50 to-rose-100",
    ring: "ring-rose-200",
  },
  {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100",
    ring: "ring-amber-200",
  },
  {
    bg: "bg-gradient-to-br from-teal-50 to-teal-100",
    ring: "ring-teal-200",
  },
];

// stable color selector (same store → same color)
const getThemeById = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_THEMES[Math.abs(hash) % COLOR_THEMES.length];
};

const AdminStoreCard = ({ store, onClick }) => {
  const isActive = store.subscription?.status === "active";
  const theme = getThemeById(store._id);

  return (
    <div
      onClick={onClick}
      className={`
        ${theme.bg}
        rounded-2xl p-4 cursor-pointer
        border border-gray-100
        shadow-sm hover:shadow-lg transition-all
        flex flex-col justify-between
        overflow-hidden
      `}
    >
      {/* TOP */}
      <div className="flex items-start gap-3 overflow-hidden">
        <img
          src={store.storeDetails?.photo || "/store.png"}
          alt="store"
          className={`w-12 h-12 rounded-xl object-cover border ring-1 ${theme.ring} shrink-0`}
        />

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-base text-gray-800 truncate"
            title={store.storeName}
          >
            {store.storeName}
          </h3>

          <p
            className="text-xs text-gray-500 truncate"
            title={store.email}
          >
            {store.email}
          </p>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="mt-4 space-y-2 text-xs text-gray-700">
        <div className="flex justify-between items-center">
          <span className="font-medium">Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold
              ${
                store.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {store.status}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium">Subscription</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            `}
          >
            {store.subscription?.plan || "free"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium">QR Ordering</span>
          <span
            className={`text-xs font-semibold ${
              store.qrOrderingEnabled
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {store.qrOrderingEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>


        <div className="flex justify-between items-center">
          <span className="font-medium">Pay First</span>
          <span
            className={`text-xs font-semibold ${
              store.qrPayFirstEnabled
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {store.qrPayFirstEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-gray-500">
        Joined on{" "}
        {new Date(store.createdAt).toLocaleDateString("en-IN")}
      </div>
    </div>
  );
};

export default AdminStoreCard;
