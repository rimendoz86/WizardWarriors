import usePhaserGame from "@hooks/usePhaserGame";
import { useRef } from "react";
import { config } from "./config";

const PhaserGame = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  usePhaserGame(config, gameRef);

  return <div ref={gameRef} />;
};

export default PhaserGame;
