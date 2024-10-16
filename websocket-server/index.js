import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 80 });

let connections = {};

wss.on("connection", function connection(ws, request) {
  // Save client connection under connecting uuid
  const uuid = request.url.slice(1);
  if (uuid.length === 36) connections[uuid] = ws;

  ws.on("error", console.error);

  ws.on("close", () => delete connections[uuid]);

  ws.on("message", function message(data) {
    data = data.toString();
    if (data.length === 36 && connections[data]) {
      // If player is connected, send update message
      connections[data].send("update");
    }
  });

  ws.send("test");
});
