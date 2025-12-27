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
    <div className="w-full flex flex-wrap row-gap-2 justify-between md:justify-start">
      {tables.map((table) => (
        <TableCard key={table._id} table={table} onRefresh={onRefresh} />
      ))}
    </div>
  );
};

export default TableList;
