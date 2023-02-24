import Token from './Token.js'
import gameService from '../services/game'
import database from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import { gameData as gameDataType, gameLog as gameLogType, token as TokenObject } from '../types'
const db = new database('reversi.db')

const alpha = [...Array(26)].map((_, i) => String.fromCharCode(i + 65))
export default class Game {
    id: string|null
    player_0_id: string|null
    player_1_id: string|null
    board: Token[][]
    turn: 0|1

    constructor () {
        this.id = null
        this.player_0_id = null
        this.player_1_id = null
        this.board = []
        this.turn = 1
    }

    /**
     * initialize the board property and return the class
     * @param size Board size
     * @returns Game
     */
    make(size: number): Game {
        this.board = gameService.createBoard(size)
        this.mergePlayableMoves(this.turn)
        return this
    }

    save(): boolean {
        let statement = null;
        if (this.id !== null) {
            statement = db.prepare('UPDATE games SET game_status = ?, turn = ? WHERE id = ?')
                .run(JSON.stringify(this.board), this.turn, this.id)
        } else {
            statement = db.prepare('INSERT INTO games (id, player_0_id, player_1_id, game_status) VALUES (?, ?, ?, ?)')
            const uuid = uuidv4();
            statement.run(uuid, uuidv4(), uuidv4(), JSON.stringify(this.board))
            this.id = uuid
        }
        return true
    }

    /**
     * Fetch game data and map into objects
     * @param id Game identifier
     * @returns this
     */
    open(id: string) : this {
        const result = db.prepare('SELECT * FROM games WHERE id = ? OR player_0_id = ? OR player_1_id = ?').get([id, id, id])
        if (result.id) {
            this.id = result.id
            this.player_0_id = result.player_0_id
            this.player_1_id = result.player_1_id
            this.turn = result.turn
            this.board = JSON.parse(result.game_status)
                .map((row: TokenObject[]) => {
                    return row.map((token: TokenObject) => {
                        return new Token(token.row, token.column, token.value, token.playable)
                    })
            })
        }
        return this
    }

    getSize() : number {
        if (this.board == null) {
            return 0
        }
        return this.board.length
    }

    getAvailableMoves () : Token[] {
        if (this.board === null) {
            throw new Error('Board not yet created')
        }
        return this.board.flat().filter(token => {
            return token.value === null &&
                gameService.getTokensAdjacentToken(this, token)
                    .filter(token => token.value !== null)
                    .length > 0
        })
    }

    getActivityLog () : gameLogType[] {
        return db.prepare('SELECT * FROM activity_log WHERE game_id = ?').all(this.id)
    }

    getPlayerNumberFromId (id: string) : 0|1 {
        const result = db.prepare(`
            SELECT
                id,
                CASE ?
                    WHEN player_0_id THEN 0
                    WHEN player_1_id THEN 1
                END as player
            FROM games WHERE ((player_0_id = ? AND turn = 0) OR (player_1_id = ? AND turn = 1))
        `).get([id, id, id])
        return result.player
    }

    play (row: number, column: number, id: string): boolean {
        let turn = this.getPlayerNumberFromId(id)
        if (turn !== this.turn) {
            throw new Error('It is not your turn')
        }
        const playableMoves = this.getPlayableMoves(turn)
        if (playableMoves.length === 0) {
            return false
        }
        if (playableMoves.find(move => move.row === row && move.column === column) !== undefined) {
            gameService.flipTokens(this, row, column, turn)
        } else {
            throw new Error('You cannot play there')
        }
        this.turn = this.turn == 0 ? 1 : 0
        this.mergePlayableMoves(this.turn)
        this.logPlayerAction(this.turn, `played @ ${alpha[column]}${row + 1}`)
        return this.save()
    }

    printWinner (player1Score: number, player0Score: number) {
        if (player1Score > player0Score) {
            console.log('Player 1 wins')
            return 1
        } else if (player0Score > player1Score) {
            console.log('Player 2 wins')
            return 0
        }
        console.log('Its a tie')
        return null
    }

    checkForWinner (player0Score: number, player1Score: number, remaining: number) {
        if (remaining === 0) {
            this.logPlayerAction(this.turn, 'Game over')
            return this.printWinner(player1Score, player0Score)
        }
        if (this.getPlayableMoves(0).length === 0 && this.getPlayableMoves(1).length === 0) {
            this.logPlayerAction(this.turn, 'No more playable moves')
            return this.printWinner(player1Score, player0Score)
        }
        return false
    }

    getGameStatus () : gameDataType {
        if (this.board === null) {
            throw new Error('Board not yet created')
        }
        if (this.id === null || this.player_0_id === null || this.player_1_id === null) {
            throw new Error('You must open the board first')
        }
        const score1 = this.countScore(1)
        const score0 = this.countScore(0)
        const size = this.getSize()
        const remaining = Math.pow(size, 2) - (score1 + score0)

        const winner = this.checkForWinner(score0, score1, remaining)

        return {
            player1: score1,
            player0: score0,
            playersTurn: this.turn === 1 ? this.player_1_id : this.player_0_id,
            tokenColor: this.turn === 1 ? 'White' : 'Black',
            remaining: remaining,
            size: size,
            activityLog: this.getActivityLog(),
            winner: winner,
        }
    }

    getBoardData () : string {
        let data = db.prepare('SELECT game_status FROM games WHERE id = ?').get(this.id)
        return JSON.parse(data.game_status)
    }

    coordinatesAreValid (row: number, column: number) : boolean {
        if (row < 0 || row > (this.getSize() - 1)) {
            // at top or bottom
            return false
        }
        if (column < 0 || column > (this.getSize() - 1)) {
            // at left or right edge
            return false
        }
        return true
    }

    getPlayableMoves (forValue: number) : Token[] {
        return this.board.flat(2).filter(token => token.playable)
    }

    mergePlayableMoves (forValue: number) : void {
        const tokens = this.getAvailableMoves().filter(token => this.checkIfPlayable(token.row, token.column, forValue))
        this.board.forEach(row => row.forEach(token => token.playable = false))
        tokens.forEach(token => {
            this.board[token.row][token.column].playable = true
        })
        this.save()
    }

    /**
     * Get the current token count for a given player
     * @param player 1|0
     * @returns Token count
     */
    countScore (player: number) : number {
        return this.board.flat(2).filter(token => token.value === player).length
    }

    getFlippedTokensForMove (row: number, column: number, forValue: number) : Token[] {
        const checkToken = new Token(row, column, forValue)
        const flippableTokens = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue
                let tokens = this.findFlippableTokens(i, j, checkToken);
                if (tokens) {
                    flippableTokens.push(tokens)
                }
            }
        }
        return flippableTokens.filter(token => token).flat()
    }

    checkIfPlayable (row: number, column: number, forValue: number) : boolean {
        return this.getFlippedTokensForMove(row, column, forValue).length > 0
    }

    getPlayerToken (id: string) {

    }

    findFlippableTokens (offsetRow: number, offsetColumn: number, originalToken: Token, currentToken: Token|null = null, accumulator: Token[]|null = null) : Token[]|null {
        if (this.board === null) {
            throw new Error('Board not yet created')
        }
        if (currentToken !== null && currentToken.value === originalToken.value) {
            // Found token match
            if (originalToken.row + offsetRow === currentToken.row && originalToken.column + offsetColumn === currentToken.column) {
                // Only reached the first adjacent token. Nothing to do.
                return null
            }
            return []
        }

        let nextRow = null
        let nextColumn = null
        if (currentToken === null) {
            // Handle first case
            nextRow = originalToken.row + offsetRow
            nextColumn = originalToken.column + offsetColumn
        } else {
            nextRow = currentToken.row + offsetRow
            nextColumn = currentToken.column + offsetColumn
        }
        if (!this.coordinatesAreValid(nextRow, nextColumn)) {
            // reached edge of board without finding a match
            return null
        }

        const neighborToken = this.board[nextRow][nextColumn]
        if (neighborToken.value === null) {
            // reached blank token without finding a match
            return null
        }
        if (currentToken === null) {
            // initial state, use newly set neighbor token with blank accumulator
            return this.findFlippableTokens(offsetRow, offsetColumn, originalToken, neighborToken)
        }

        const returnedAccumulator = this.findFlippableTokens(offsetRow, offsetColumn, originalToken, neighborToken, accumulator)
        if (returnedAccumulator !== null) {
            // Found flippable tokens
            // cascade back to home
            returnedAccumulator.push(currentToken)
            return returnedAccumulator
        }
        return null
    }

    // Prints board to console
    printBoard () {
        if (this.board === null) {
            throw new Error('Board not yet created')
        }
        const boardSize = this.getSize()
        let boardString = '   '
        for (let i = 0; i < boardSize; i++) {
            boardString += ' ' + i
        }
        boardString += '\n'
        boardString += '   ' + '_'.repeat(boardSize * 2 + 1) + '\n'
        for (let i = 0; i < boardSize; i++) {
            boardString += i + '  |'
            for (let j = 0; j < boardSize; j++) {
                boardString += this.board[i][j].getTokenCharacter() + '|'
            }
            boardString += '\n'
        }
        boardString += '   ' + '‾'.repeat(boardSize * 2 + 1)
        return boardString
    }

    logPlayerAction(player: number, action: string) {
        const statement = db.prepare('INSERT INTO activity_log (game_id, player_id, action) VALUES (?, ?, ?)')
        statement.run(this.id, player, action)
    }
}