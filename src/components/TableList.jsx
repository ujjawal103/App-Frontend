import React from "react";
import TableCard from "./TableCard";
import Loading from "./Loading";

const TableList = ({ tables, loading, onRefresh }) => {
  if (loading) return <Loading />;

  if (tables.length === 0)
    return (
      <div className="text-center text-gray-500 mt-20">
        <p>No tables found.</p>
        <p className="text-sm">Click "Add Table" to create one.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard key={table._id} table={table} onRefresh={onRefresh} />
      ))}
    </div>
  );
};

export default TableList;
