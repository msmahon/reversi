# reversi

⚫️⚪️\
⚪️⚫️

A recreation of the game "Reversi" (also known as Othello).

<https://en.wikipedia.org/wiki/Reversi>

Front: React (TypeScript), Tailwind
Back: NextJs (TypeScript), Prisma (SQLite)

## Install

You will need to supply your own pusher credentials in the `.env` file. This is necessary for real time updates on the client.

```
# Pusher
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```

`npm install`
`npm run dev`

### Using the application

Games are generated with three separate ids: the game id, player 1 id, and player 2 id. Adding the player id to the end of the url (localhost:3000/{uuid}) will load the page for that player. The idea is that users will not be required to sign in so a unique link/id will be provided. Anyone with this id may play for the player but they would have to share it.

For the moment, games are displayed in a list with links to both player ids. Eventually, each player's id will be hidden from others.
