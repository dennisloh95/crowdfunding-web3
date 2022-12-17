import React from "react";

interface CustomButtonProps {
  btnType: "button" | "reset" | "submit" | undefined;
  title: string;
  handleClick: () => void;
  styles?: string;
}

const CustomButton = ({
  btnType = "button",
  title,
  handleClick,
  styles,
}: CustomButtonProps) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
