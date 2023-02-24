export interface token {
    row: number,
    column: number,
    value: number|null,
    playable?: boolean
}

export interface gameData {
    player1: number,
    player0: number,
    playersTurn: string,
    tokenColor: 'Black'|'White',
    remaining: number,
    size: number,
    activityLog: gameLog[]
    winner: 0|1|null|false
}

export interface gameLog {
    id: number,
    game_id: string,
    player_id: number,
    action: string,
    created: string
}
