import WebSocket, { WebSocketServer } from 'ws'
import url from 'url'
import database from 'better-sqlite3'
const db = new database('reversi.db')
import { gameData } from './types'

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

                conn.send('affirmative response')
            })
        })
        ws.on('listening', () => console.log('websocket server listening on port 8081'))
    },

    // Send payload to clients matching the game id or either player id
    broadcastStatus: (uuid: string, payload: {game_data: gameData, board_data: any}) => {
        let result = db.prepare('SELECT id, player_1_id, player_2_id FROM games WHERE id = ? OR player_1_id = ? OR player_2_id = ?').all(uuid, uuid, uuid)
        let clientIds = Object.values(result[0])
        clients.filter(client => clientIds.includes(client.uuid)).forEach(client => {
            if (client.client.readyState === WebSocket.OPEN) {
                client.client.send(JSON.stringify(payload), { binary: false })
            }
        })
    }
}