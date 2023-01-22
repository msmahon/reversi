import Chalk from 'chalk'

export default class Token {
    row: number
    column: number
    value: number|null
    playable?: boolean

    constructor (row: number, column: number, value: number|null = null, playable?: boolean) {
        this.row = row
        this.column = column
        this.value = value
        this.playable = playable
    }

    getTokenCharacter () : string {
        if (this.value === null) {
            return ' '
        } else if (this.value === 1) {
            return Chalk.red('◉')
        } else {
            return Chalk.blue('◉')
        }
    }
}
