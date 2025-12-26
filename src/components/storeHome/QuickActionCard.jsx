import { motion } from "framer-motion";

const QuickActionCard = ({
  icon,
  label,
  value,
  onClick,
  delay = 0,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative cursor-pointer overflow-hidden rounded-2xl p-4 bg-pink-700 text-black shadow"
    >
      {/* Yellow half circle */}
      <div className="absolute -bottom-17 -right-20 w-40 h-50 bg-yellow-400 rounded-full"></div>
      {/* Yellow half circle */}
      <div className="absolute -top-30 -left-30 w-40 h-40 bg-yellow-400 rounded-full"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* BIG ICON */}
        <div className="flex justify-start mb-4 text-white/80">
          <i className={`${icon} text-5xl opacity-90`}></i>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/80 mb-3"></div>

        {/* BOTTOM ROW */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-white">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{value}</span>
            <i className="ri-arrow-right-s-line text-xl"></i>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActionCard;
