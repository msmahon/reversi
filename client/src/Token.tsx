type TokenProps = {
    token: {
        row: Number,
        column: Number,
        value?: 0|1,
        playable?: boolean,
    },
    uuid: String,
    yourTurn: boolean,
    errorSetter: CallableFunction
}

const Token = (props: TokenProps) => {
    const playable = props?.token.playable === true && props.yourTurn

    const tokenOnClick = () => {
        fetch(`http://localhost:3001/api/play`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: props.uuid,
                    row: props.token.row,
                    column: props.token.column,
                })
            })
            .then(async (response: Response) => {
                if (! response.ok) {
                    response.json().then(error => {
                        props.errorSetter(error.details.map((error: {message: string}) => error.message))
                    })
                }
                // fetchBoardStatus()
            })
        }

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

    return <div
        className={`${commonClasses} ${playable ? playableClasses : ''}`}
        onClick={() => playable ? tokenOnClick() : null}
    >
        {tokenIcon}
    </div>
}

export default Token;
