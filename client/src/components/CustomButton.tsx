import React from "react";

interface CustomButtonProps {
  btnType: "button" | "reset" | "submit" | undefined;
  title: string;
  handleClick?: () => void;
  styles?: string;
  disabled?: boolean;
}

const CustomButton = ({
  btnType = "button",
  title,
  handleClick,
  styles,
  disabled = false,
}: CustomButtonProps) => {
  return (
    <button
      type={btnType}
      disabled={disabled}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
