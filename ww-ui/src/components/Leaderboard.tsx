import { GameStatsResponse } from "src/types/index.types";
import styles from "./Leaderboard.module.css";

const Leaderboard = ({ data }: { data: GameStatsResponse[] | null }) => {
  const isLoading = data === null;
  const placeholderRows = Array(15).fill(null);

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>Leaderboard</h2>
      <div className={styles.headerRow}>
        <span>Rank</span>
        <span>Username</span>
        <span>Level</span>
        <span>Kills</span>
        {/* <span>Team Kills</span> */}
        <span>Enemies</span>
        <span>Allies</span>
        <span>Game Status</span>
      </div>
      {isLoading ? (
        placeholderRows.map((_, index) => (
          <div
            key={index}
            className={`${styles.playerRow} ${styles.skeletonRow}`}
          >
            <span className={`${styles.skeleton} ${styles.rank}`}></span>
            <span className={`${styles.skeleton} ${styles.username}`}></span>
            <span className={`${styles.skeleton} ${styles.level}`}></span>
            <span className={`${styles.skeleton} ${styles.kills}`}></span>
            {/* <span className={`${styles.skeleton} ${styles.deaths}`}></span> */}
            <span className={`${styles.skeleton} ${styles.enemies}`}></span>
            <span className={`${styles.skeleton} ${styles.allies}`}></span>
            <span className={`${styles.skeleton} ${styles.status}`}></span>
          </div>
        ))
      ) : data && data.length > 0 ? (
        data.slice(0, 15).map((player, index) => (
          <div key={player.id} className={styles.playerRow}>
            <span className={styles.rank}>{index + 1}</span>
            <span className={styles.username}>{player.username}</span>
            <span>{player.player_level}</span>
            <span className={styles.kills}>{player.player_kills}</span>
            {/* <span>{player.team_deaths}</span> */}
            <span>{player.total_enemies}</span>
            <span>{player.total_allies}</span>
            <span>{player.is_game_over ? "✔️" : "⏳"}</span>
          </div>
        ))
      ) : (
        <div className={styles.title}>No data available</div>
      )}
    </div>
  );
};

export default Leaderboard;
