import { gameLog } from "../../../server/src/types";

type MoveHistoryProps = { activityLog: gameLog[] };

export default function MoveHistory({ activityLog }: MoveHistoryProps) {
  return (
    <div id="move-history">
      <div className="bg-stone-400 rounded-xl p-4">
        <h3>Move History</h3>
        <div id="move-history-log">
          <div id="move-history-overflow">
            {activityLog.map((log) => {
              return (
                <div key={crypto.randomUUID()}>
                  {log.player_id === 0 ? "⚪" : "⚫"} {log.action}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
