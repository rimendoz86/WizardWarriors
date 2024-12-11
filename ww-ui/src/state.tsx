import { atom } from "jotai";
import { createStore } from "jotai/vanilla";
import { GameStats } from "src/types/index.types";

const store = createStore();

export const gameStats: GameStats = {
  game_id: 0,
  username: "",
  user_id: 0,
  team_deaths: 0,
  team_kills: 0,
  player_level: 1,
  player_kills: 0,
  player_kills_at_level: 0,
  total_allies: 1,
  total_enemies: 1,
  is_game_over: false,
  game_created_at: new Date().toISOString(),
  game_updated_at: new Date().toISOString(),
};

export const gameStatsAtom = atom<GameStats>(gameStats);

export const getGameStats = () => store.get(gameStatsAtom);

export const setGameStats = (updater: (prev: GameStats) => GameStats) => {
  const current = store.get(gameStatsAtom);
  store.set(gameStatsAtom, updater(current));
};

export const getStore = () => store;

// TODO:
// Send game stats to the backend.
// Allies and enemies need damage capability and health.
