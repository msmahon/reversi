# reversi

⚫️⚪️\
⚪️⚫️

A recreation of the game "Reversi" (also known as Othello).

<https://en.wikipedia.org/wiki/Reversi>

Node, TypeScript, React, and WebSockets. The application is split into separate client and server sections.

## Install

Run `npm install` from the client and server directories.
Run `npm run start` from the client and server directories (separate terminal sessions).
From the browser interface, click the "reset" button to generate a new database.
Click the "new" button to generate a new game.

The games are currently displayed as a list beneath the move history. You can switch between players here.

### Using the application

Games are generated with three separate ids: the game id, player 1 id, and player 2 id. Adding the player id to the end of the url (localhost:3000/{uuid}) will load the page for that player. The idea is that users will not be required to sign in so a unique link/id will be provided. Anyone with this id may play for the player but they would have to share it.
