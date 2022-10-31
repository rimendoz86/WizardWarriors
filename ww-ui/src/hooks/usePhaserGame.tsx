import { Game, Types } from "phaser";
import { useEffect, useState } from "react";

const usePhaserGame = (
  config: Types.Core.GameConfig,
  containerRef: React.RefObject<HTMLDivElement>
): Game | undefined => {
  const [game, setGame] = useState<Game>();
  useEffect(() => {
    if (!game && containerRef.current) {
      const newGame = new Game({ ...config, parent: containerRef.current });
      setGame(newGame);
    }
    return () => {
      game?.destroy(true);
    };
  }, [config, containerRef, game]);

  return game;
};
export default usePhaserGame;
