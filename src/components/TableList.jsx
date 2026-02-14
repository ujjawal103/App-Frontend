import React from "react";
import TableCard from "./TableCard";
import Loading from "./Loading";
import TableCardSkeleton from "./TableCardSkeleton";

const TableList = ({ tables, loading, onRefresh }) => {
     if (loading) {
    return (
      <div className="w-full flex flex-wrap row-gap-2 justify-between md:justify-start">
        {[...Array(6)].map((_, index) => (
          <TableCardSkeleton key={index} />
        ))}
      </div>
    );
  }

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
