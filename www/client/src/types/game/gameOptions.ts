/*
    GAME OPTIONS TYPES AND INTERFACES
*/

import { Room } from './gameRoom'

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum MapType {
  DEFAULT = 'default',
  MAP1 = 'map1',
  MAP2 = 'map2',
}

export interface GameOptions {
  map: MapType
  difficulty: DifficultyLevel
  powerUps: boolean
  room?: Room
}
