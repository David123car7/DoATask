"use client";

interface ButtonParams {
    onClick: () => void;
    name: string;
    className: string;
  }
  
  export default function Button({ onClick, name, className }: ButtonParams) {
    return (
      <button onClick={onClick} className={className}>
        {name}
      </button>
    );
  }