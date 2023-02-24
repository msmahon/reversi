import WebSocket, { WebSocketServer } from 'ws'
import url from 'url'
import database from 'better-sqlite3'
const db = new database('reversi.db')
import Game from './models/Game'

var ws: WebSocketServer
var clients: {"uuid": string|string[], "client": WebSocket.WebSocket}[] = []

export default {
    initialize: (port: number) => {
        ws = new WebSocketServer({ port: port })
        ws.on('connection', (conn, req) => {
            // Register connection with provided uuid for future updates
            if (req.url) {
                const uuid = url.parse(req.url, true)
                if (uuid.query.id) {
                    clients.push({"uuid": uuid.query.id, "client": conn})
                }
            }

            // Maybe use this later for full websocket communication
            conn.on('message', (message: {action: string, payload: any}, isBinary) => {
                console.log('socket inbound: ' + message)

                switch (message.action) {
                    case 'play':
                        // reversiController.play()
                        break
                    default:
                        break
                }
                ws.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send('broadcasting data', { binary: isBinary })
                    }
                });
            })
        })
        ws.on('listening', () => console.log('websocket server listening on port 8081'))
    },

    // Send payload to clients matching the game id or either player id
    broadcastStatus: (Game: Game) => {
        const payload = {
            board_data: Game.getBoardData(),
            game_data: Game.getGameStatus()
        }
        let result = db.prepare('SELECT id, player_0_id, player_1_id FROM games WHERE id = ?').all(Game.id)
        let clientIds = Object.values(result[0])
        clients.filter(client => clientIds.includes(client.uuid)).forEach(client => {
            if (client.client.readyState === WebSocket.OPEN) {
                client.client.send(JSON.stringify(payload), { binary: false })
            }
        })
    }
}