import { ReactNode } from "react";

type buttonProps = {
  children: ReactNode;
  isDanger?: boolean;
  onClick: CallableFunction;
};

export default function Button({
  children,
  isDanger = false,
  onClick,
}: buttonProps) {
  let colorClasses =
    "bg-blue-300 text-blue-900 hover:bg-blue-600 hover:text-blue-100";
  if (isDanger) {
    colorClasses =
      "bg-red-300 text-red-900 hover:bg-red-600 hover:text-red-100";
  }
  return (
    <button
      onClick={() => onClick()}
      className={"px-1 rounded-md " + colorClasses}
    >
      {children}
    </button>
  );
}
