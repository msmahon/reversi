import { Activity } from "@prisma/client";

export type token = {
  row: number;
  column: number;
  value: 0 | 1 | null;
};

export type board = token[][];

export type gameData = {
  id: string;
  player1: {
    id: string;
    score: number;
  };
  player2: {
    id: string;
    score: number;
  };
  playersTurn: number | null;
  yourTurn: boolean;
  playableCells: playableVectors[];
  board: token[][];
  activityLog: Activity[];
  winner: 0 | 1 | null | false;
};

export type gameLog = {
  id: number;
  game_id: string;
  player_id: number;
  action: string;
  created: string;
};

export type tableGamesRecord = {
  id: string;
  player_0_id: string;
  player_1_id: string;
  turn: 1 | 0;
  game_status: string;
  created: string;
};

export type playableVectors = {
  origin: token;
  vectors: vectors;
};

export type vectors = {
  N: token[];
  NE: token[];
  E: token[];
  SE: token[];
  S: token[];
  SW: token[];
  W: token[];
  NW: token[];
};
