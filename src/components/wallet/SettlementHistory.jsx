import SettlementCard from "./SettlementCard";
import EmptyStateMessage from "../orders/EmptyStateMessage";

const SettlementHistory = ({ settlements }) => {
  if (settlements.length === 0) {
    return <EmptyStateMessage message="No settlement history found" />;
  }

  return (
    <div className="space-y-3">
      {settlements.map((s) => (
        <SettlementCard key={s._id} settlement={s} />
      ))}
    </div>
  );
};

export default SettlementHistory;
