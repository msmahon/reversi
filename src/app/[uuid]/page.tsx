"use client";
import App from "@/components/App";

export default function Home({ params }: { params: { uuid: string } }) {
  const { uuid } = params;
  return <App uuid={uuid} />;
}
