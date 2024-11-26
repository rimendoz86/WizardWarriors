import usePhaserGame from "@hooks/usePhaserGame";
import { useEffect, useRef } from "react";
import { config } from "./config";
import { EventBus } from "./EventBus";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface PhaserGameProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

const PhaserGame = ({ currentActiveScene }: PhaserGameProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<IRefPhaserGame>({ game: null, scene: null });

  usePhaserGame(config, gameRef);

  useEffect(() => {
    const handleSceneReady = (scene_instance: Phaser.Scene) => {
      // Update game instance reference
      gameInstanceRef.current = {
        game: gameInstanceRef.current.game,
        scene: scene_instance,
      };

      // Call current active scene callback if provided
      if (currentActiveScene && typeof currentActiveScene === "function") {
        currentActiveScene(scene_instance);
      }
    };

    // Listen for scene ready event
    EventBus.on("current-scene-ready", handleSceneReady);

    // Cleanup listener
    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [currentActiveScene]);

  return <div ref={gameRef} />;
};

export default PhaserGame;
