import { Wallet } from "lucide-react";

const WalletHeader = ({ balance }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-5 text-white">

      {/* Desktop */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet size={22} className="text-violet-400" />
          <h2 className="text-lg font-semibold">Wallet</h2>
        </div>
        <p className="text-xl font-bold">₹{balance.toFixed(2)}</p>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col items-center gap-2">
        <Wallet size={28} className="text-violet-400" />
        <p className="text-sm text-gray-400">Wallet</p>
        <p className="text-xl font-bold">₹{balance.toFixed(2)}</p>
      </div>

    </div>
  );
};

export default WalletHeader;
