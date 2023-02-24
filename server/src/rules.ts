import database from "better-sqlite3"
import GameClass from "./models/Game"
import Joi from "joi"
const db = new database('reversi.db')

export default {
    isValidId: (id: string, helpers: Joi.CustomHelpers) => {
        const result = db.prepare("SELECT id, player_0_id, player_1_id FROM games WHERE id = ? OR player_0_id = ? OR player_1_id = ?").get(id, id, id)
        if (result) {
            if (result.id === id) {
                // User is just viewing the read only game
                return true
            } else if ((result.turn === 0 && result.player_0_id !== id) || (result.turn === 1 && result.player_1_id !== id)) {
                return helpers.message({custom: 'It is not your turn'})
            }
        } else {
            return helpers.message({custom: 'Invalid game id'})
        }
        return id
    },

    isPlayable: (column: number, row: number, id: string) => {
        const result = <{id: string, player: number}> db.prepare(`
            SELECT
                id,
                CASE ?
                    WHEN player_0_id THEN 0
                    WHEN player_1_id THEN 1
                END as player
            FROM games WHERE ((player_0_id = ?) OR (player_1_id = ?))
        `).get([id, id, id])
        const game = new GameClass()
        game.open(result.id)
        if (! game.checkIfPlayable(row, column, result.player)) {
            throw new Error('There are no playable moves')
        }
        return true
    },

    convertToPlayerTurn: (id: string) => {
        const result = <{player: number}> db.prepare(`
            SELECT
                CASE ?
                    WHEN player_0_id THEN 0
                    WHEN player_1_id THEN 1
                END as player
            FROM games WHERE ((player_0_id = ? AND turn = 0) OR (player_1_id = ? AND turn = 1))
        `).get([id, id, id])
        return result.player;
    }
}