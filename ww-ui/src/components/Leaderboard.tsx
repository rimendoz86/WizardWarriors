import { GameStatsResponse } from "src/types/index.types";
import styles from "./Leaderboard.module.css";

const Leaderboard = ({ data }: { data: GameStatsResponse[] }) => {
  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>Leaderboard</h2>
      <div className={styles.headerRow}>
        <span>Rank</span>
        <span>Username</span>
        <span>Level</span>
        <span>Kills</span>
        <span>Deaths</span>
        <span>Enemies</span>
        <span>Allies</span>
        <span>Game Status</span>
      </div>
      {data.map((player, index) => (
        <div key={player.username} className={styles.playerRow}>
          <span className={styles.rank}>{index + 1}</span>
          <span className={styles.username}>{player.username}</span>
          <span>{player.player_level}</span>
          <span className={styles.kills}>{player.player_kills}</span>
          <span>{player.team_deaths}</span>
          <span>{player.total_enemies}</span>
          <span>{player.total_allies}</span>
          <span>{player.is_game_over ? "✔️" : "⏳"}</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
