import Token from '../models/Token'
import Game from '../models/Game'

export default {
    /**
     * Construct the rows or tokens that hold the game data
     * @param size Board size
     * @returns Multidimensional array of tokens
     */
     createBoard (size: number): Token[][] {
        const board: Token[][] = []
        for (let i = 0; i < size; i++) {
            board.push([])
            for (let j = 0; j < size; j++) {
                board[i][j] = new Token(i, j)
            }
        }
        board[size / 2 - 1][size / 2 - 1].value = 1
        board[size / 2][size / 2 - 1].value = 0
        board[size / 2 - 1][size / 2].value = 0
        board[size / 2][size / 2].value = 1
        return board
    },

    getTokensAdjacentToken (game: Game, token: Token) : Token[] {
        if (game.board === null) {
            throw new Error('Board not yet created')
        }
        const adjacentTokens = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) {
                    continue
                }
                const adjacentRow = token.row + i
                const adjacentColumn = token.column + j
                if (adjacentRow < 0 || adjacentRow > game.getSize() - 1) {
                    continue
                }
                if (adjacentColumn < 0 || adjacentColumn > game.getSize() - 1) {
                    continue
                }
                adjacentTokens.push(game.board[adjacentRow][adjacentColumn])
            }
        }
        return adjacentTokens
    },

    flipTokens (game: Game, row: number, column: number, value: number) {
        if (game.board === null) {
            throw new Error('Board not yet created')
        }
        const tokens = game.getFlippedTokensForMove(row, column, value)
        game.board[row][column].value = value
        tokens.forEach(token => { token.value = value })
    }
}