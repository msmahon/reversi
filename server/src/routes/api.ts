import { Router } from "express"
const router = Router()

// Controllers
import ReversiController from '../controllers/reversiController'

// Clear db tables
router.get('/reset', ReversiController.reset)

router.get('/game-list', ReversiController.getGameList)

router.get('/player/:id', ReversiController.getPlayerState)

/* Create new game of size */
router.get('/new/:size', ReversiController.store)

/* get board data */
router.get('/show/:id', ReversiController.show)

/* Play move */
router.post('/play', ReversiController.play)

export default router
