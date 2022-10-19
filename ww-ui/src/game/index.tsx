import { useRef } from "react";
import { useGame } from "src/hooks/useGame";
import gameConfig from "./config";

const PhaserGame = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  useGame(gameConfig, gameRef);

  return <div ref={gameRef} />;
};

export default PhaserGame;
