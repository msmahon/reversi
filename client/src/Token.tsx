// import './index.css'

type TokenProps = {
    token: {
        row: Number,
        column: Number,
        value: Number|null,
        playable?: boolean,
    },
    tokenColor: 'Black'|'White',
    yourTurn: boolean,
}

const Token = (props: TokenProps) => {
    const played = props.token.value !== null
    const playable = props?.token.playable === true && props.yourTurn
    let color
    if (played) {
        color = props.token.value === 1 ? 'Black' : 'White'
    } else if (playable) {
        color = props.tokenColor
    }

    const tokenIcon = color === 'Black' ? '⚫' : '⚪';

    const commonClasses = 'w-16 h-16 text-center text-5xl pt-2 bg-stone-100 border border-stone-300 shadow-inner shadow-stone-400'

    if (color) {
        if (played) {
            return <div className={`${commonClasses}`}>{tokenIcon}</div>
        } else if (playable) {
            if (color === 'White') {
                return <div className={`${commonClasses} bg-orange-200 cursor-pointer`}>
                    <span className={`before:content-['⚪'] opacity-0 hover:opacity-40`}></span>
                </div>
            } else {
                return <div className={`${commonClasses} bg-orange-200 cursor-pointer`}>
                    <span className={`before:content-['⚫'] opacity-0 hover:opacity-20`}></span>
                </div>
            }
        } else {
            return <div className={`${commonClasses} text-transparent shadow-`}>{tokenIcon}</div>
        }
    }
    return <div className={commonClasses}></div>

}

export default Token;
