import { ReactNode } from "react";

type buttonProps = {
  children: ReactNode;
  onClick: CallableFunction;
};

export default function Button({ children, onClick }: buttonProps) {
  return (
    <button
      onClick={() => onClick()}
      className="px-1 rounded-md bg-blue-300 text-blue-900 hover:bg-blue-600 hover:text-blue-100"
    >
      {children}
    </button>
  );
}
