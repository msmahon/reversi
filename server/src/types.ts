export type token = {
  row: number;
  column: number;
  value?: 0 | 1;
  playable?: boolean;
};

export type gameData = {
  player0: number;
  player1: number;
  playersTurn: string;
  remaining: number;
  size: number;
  activityLog: gameLog[];
  winner: 0 | 1 | null | false;
};

export type gameLog = {
  id: number;
  game_id: string;
  player_id: number;
  action: string;
  created: string;
};
