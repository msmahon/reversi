import WebSocket from "ws";

export function broadcast(uuids: Array<string>) {
  const server = new WebSocket(`ws://localhost:80/`);
  uuids.forEach((uuid) => {
    server.on("open", function () {
      server.send(uuid);
    });
  });
}
