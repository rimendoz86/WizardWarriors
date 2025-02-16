import usePhaserGame from "@hooks/usePhaserGame";
import { RefObject, useEffect, useRef, useState } from "react";
import { config } from "./config";
import { EventBus } from "./EventBus";
import { GameStats } from "src/types/index.types";
import useApiService from "@hooks/useApiService";
import { LogBox } from "src/components/LogBox";

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

  const apiService = useApiService();

  const [logMessages, setLogMessages] = useState<string[]>([]);

  usePhaserGame(config, gameRef as RefObject<HTMLDivElement>); // TODO: react 19 doesn't take null as a ref

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

  useEffect(() => {
    const handleSaveGame = async (stats: GameStats) => {
      const res = await apiService?.saveGame(stats);
      console.log(res);
    };

    EventBus.on("save-game", handleSaveGame);

    return () => {
      EventBus.removeListener("save-game");
    };
  }, [apiService]);

  useEffect(() => {
    const handleLogDamage = async (message: string) => {
      setLogMessages((prev) => [...prev, message]);
    };
    const handleLogEvents = async (message: string) => {
      setLogMessages((prev) => [...prev, message]);
    };

    EventBus.on("log-damage", handleLogDamage);
    EventBus.on("log-events", handleLogEvents);

    return () => {
      EventBus.removeListener("log-damage");
      EventBus.removeListener("log-events");
    };
  }, []);

  return (
    <>
      <div ref={gameRef} />
      <LogBox messages={logMessages} />
    </>
  );
};

export default PhaserGame;
