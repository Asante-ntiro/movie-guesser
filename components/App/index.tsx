"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function App() {
  return <Game />;
}
