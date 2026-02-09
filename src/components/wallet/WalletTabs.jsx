import { Clock, History } from "lucide-react";

const WalletTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-4 border-b">
      <button
        onClick={() => setActiveTab("pending")}
        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1
          ${activeTab === "pending"
            ? "border-b-2 border-pink-600 text-pink-600"
            : "text-gray-500"}`}
      >
        <Clock size={16} />
        Pending Settlements
      </button>

      <button
        onClick={() => setActiveTab("history")}
        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1
          ${activeTab === "history"
            ? "border-b-2 border-pink-600 text-pink-600"
            : "text-gray-500"}`}
      >
        <History size={16} />
        History
      </button>
    </div>
  );
};

export default WalletTabs;
