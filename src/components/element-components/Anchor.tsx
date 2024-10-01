import React from "react";
import { ReactNode } from "react";

type anchorProps = {
  children: ReactNode;
  href: string;
  onClick?: CallableFunction;
};

export default function Anchor({ children, href, onClick }: anchorProps) {
  return (
    <a
      href={href}
      onClick={() => (onClick ? onClick() : null)}
      className="text-blue-700 hover:text-blue-300 underline"
    >
      {children}
    </a>
  );
}
