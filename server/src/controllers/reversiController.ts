import { Request, Response, NextFunction } from "express"
import Joi from "joi"
import database from 'better-sqlite3'
import GameClass from "../models/Game"
import utility from "../services/utility"
import rules from "../rules"
import { WebSocketService } from "../app"
const db = new database('reversi.db')

export default {
    store: function (req: Request, res: Response) {
        const size = parseInt(req.params.size)
        const Game = new GameClass
        Game.make(size)
        Game.save()
        return res.json({id: Game.id})
    },

    play: async function (req: Request, res: Response, next: NextFunction) {
        const {error, value} = Joi.object({
            id: Joi.string().uuid().custom(rules.isValidId).required(),
            row: Joi.number().required(),
            column: Joi.number().required(),
        }).validate(req.body)

        if (error !== undefined && error.details) {
            return res.status(400).json(error)
        }

        const id     = value.id
        const row    = parseInt(value.row)
        const column = parseInt(value.column)

        // Open game
        const Game = new GameClass
        Game.open(id)

        // Play turn
        try {
            Game.play(row, column, id)
        } catch (e) {
            if (e instanceof Error) {
                return res.status(400).send({message: e.message})
            }
            return res.status(400).send({message: 'Something went wrong'})
        }

        // Broadcast to matching clients
        WebSocketService.broadcastStatus(Game)
        return res.status(200).send({message: 'success'})
    },

    show: async function (req: Request, res: Response) {
        const Game = (new GameClass).open(req.params.id)
        if (Game.id) {
            return res.send({
                board_data: Game.getBoardData(),
                game_data: Game.getGameStatus(),
            })
        }
        return res.status(500)
    },

    getPlayerState: async function (req: Request, res: Response) {
        //
    },

    reset: async function (req: Request, res: Response) {
        // Create games table
        try {
            utility.reset()
        } catch (e) {
            console.log(e)
            return res.json({"status": "failure"})
        }
        return res.json({"status": "success"})
    },

    getGameList: async function (req: Request, res: Response) {
        const data = db.prepare('SELECT id, player_0_id, player_1_id FROM games').all();
        return res.json(data)
    },
}
