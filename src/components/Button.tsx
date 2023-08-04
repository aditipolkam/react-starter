import React from "react";

const Button = ({
  label,
  handleClick,
}: {
  label: string;
  handleClick: () => void;
}) => {
  return (
    <button className="p-2 rounded-lg bg-primary" onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
