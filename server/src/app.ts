import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import debug from 'debug'
import path from 'path'
import apiRouter from './routes/api'
import WebSocketService from './ws-server'

const whitelist = ['http://localhost:3000' ,'ws://localhost:8080'];

const app = express();

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.json()) // middleware to parse json data
app.use(express.urlencoded({ extended: false })) // middleware to parse query string
app.use(cookieParser()) // middleware for parsing cookie data
app.use(express.static(path.resolve('../') + '/client/build/')) // set public path for static assets

// Routing
app.get('/', (req, res, next) => res.sendFile(path.resolve('../') + '/client/build/index.html')) // root path serves the static index file, the root of the application
app.use('/api', apiRouter) // set url prefix for api calls

// Start server
const port = '3001'
const server = app.listen(port)
server.on('error', onError)
server.on('listening', onListening)


function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1)
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1)
        break;
      default:
        throw error
    }
}

function onListening() {
    var addr = server.address();
    // var addr = server.address();
    if (addr == null) {
        return;
    }
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind)
}

WebSocketService.initialize(8081)

export {app, WebSocketService}
