export const SCENES = {
  MENU: "MenuScene",
  GAME: "GameScene",
  GAME_OVER: "GameOverScene",
};

export const ANIMS = {
  PLAYER: {
    IDLE: "player-idle",
    UP: "player-up",
    DOWN: "player-down",
    LEFT: "player-left",
    RIGHT: "player-right",
  },
  ALLY: {
    IDLE: "ally-idle",
    UP: "ally-up",
    DOWN: "ally-down",
    LEFT: "ally-left",
    RIGHT: "ally-right",
  },
  SLIME: {
    IDLE: "slime-idle",
  },
};

export const ENTITY = {
  PLAYER: "player",
  ALLY: "ally",
  ENEMY: {
    SLIME: "slime",
  },
};

export const CONSTANTS = {
  ANIMS,
  ENTITY,
  SCENES,
};
