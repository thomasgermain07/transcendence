export enum Direction {
	UP = "up",
	DOWN = "down",
	NOT = "not",
}

export enum GameState {
	WAITING = "waiting",
	PLAYING = "playing",
	CANCELLED = "cancelled",
	OVER = "over",
}

export enum GameMode {
	DUEL = "duel",
	LADDER = "ladder",
	PRIVATE = "private"
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum MapType {
  DEFAULT = 'default',
  MAP1 = 'map1',
  MAP2 = 'map2'
}