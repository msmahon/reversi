import Database from 'better-sqlite3'
const db = new Database('reversi.db')

export default {
    reset() {
        // Recreate games table
        db.exec('DROP TABLE IF EXISTS games')
        db.exec(`CREATE TABLE games (
            id TEXT PRIMARY KEY NOT NULL,
            player_0_id TEXT NOT NULL,
            player_1_id TEXT NOT NULL,
            turn TINYINT DEFAULT 1,
            game_status TEXT,
            created TEXT DEFAULT (DATETIME('now'))
        )`)

        // Recreate activity_log
        db.exec('DROP TABLE IF EXISTS activity_log')
        db.exec(`CREATE TABLE activity_log (
            id INTEGER PRIMARY KEY NOT NULL,
            game_id INTEGER NOT NULL,
            player_id INTEGER,
            action TEXT NOT NULL,
            created TEXT DEFAULT (DATETIME('now'))
        )`)
    }
}
