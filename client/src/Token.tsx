type TokenProps = {
    token: {
        row: Number,
        column: Number,
        value?: 0|1,
        playable?: boolean,
    },
    yourTurn: boolean,
}

const Token = (props: TokenProps) => {
    const playable = props?.token.playable === true && props.yourTurn

    const iconFromValue = (value?: 0|1) => {
        switch (value) {
            case 0:
                return '⚫'
            case 1:
                return '⚪'
            default:
                return ''
        }
    }

    const tokenIcon = iconFromValue(props.token.value)

    const commonClasses = 'w-16 h-16 text-center text-5xl pt-2 bg-stone-100 border border-stone-300 shadow-inner shadow-stone-400'
    const playableClasses = 'bg-orange-200 cursor-pointer'

    return <div className={`${commonClasses} ${playable ? playableClasses : ''}`}>
        {tokenIcon}
    </div>
}

export default Token;
