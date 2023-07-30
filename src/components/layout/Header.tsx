import React from "react";
import Button from "../elements/Button";

const Header = () => {
  const handleButtonClick = () => {
    console.log("Clicked");
  };
  return (
    <div className="w-full flex justify-between">
      <div className="flex items-center gap-2 text-xl">
        <img src="/react.svg" alt="logo" className="w-12 h-12" />
        React Starter
      </div>
      <div className="flex items-center">
        <Button label={"Click"} handleClick={handleButtonClick} />
      </div>
    </div>
  );
};

export default Header;
