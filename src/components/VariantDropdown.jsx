import React from "react";

const VariantDropdown = ({ variants, selected, setSelected }) => {
  return (
    <select
      value={selected?.name}
      onChange={(e) =>
        setSelected(variants.find((v) => v.name === e.target.value))
      }
      className="mt-1 border rounded-md p-1 text-sm outline-none"
    >
      {variants.map((v) => (
        <option key={v.name} value={v.name} disabled={!v.available}>
          {v.name} {v.available ? "" : "(Unavailable)"}
        </option>
      ))}
    </select>
  );
};

export default VariantDropdown;
