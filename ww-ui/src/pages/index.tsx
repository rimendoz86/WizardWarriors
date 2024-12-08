import dynamic from "next/dynamic";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
/* import { MessageType } from "src/rpc/api/proto/ipc_pb"; */
import useApiService from "@hooks/useApiService";
import { Provider } from "jotai";
import Image from "next/image";
import Leaderboard from "src/components/Leaderboard";
import PlayerForm from "src/components/PlayerForm";
import { GameStatsResponse } from "src/types/index.types";
import styles from "../styles/index.module.css";
import { getStore } from "src/state";

const Home: NextPage = () => {
  const [playable, setPlayable] = useState<boolean>();
  const [isLoading, setLoading] = useState<boolean>();
  const [leaderboardData, setLeaderboardData] = useState<GameStatsResponse[]>(
    []
  );
  /* const { ws } = useSocket(); */
  const apiService = useApiService();

  const PhaserGame = dynamic(
    () => import("../game/app").finally(() => setLoading(false)),
    { ssr: false }
  );

  useEffect(() => {
    apiService?.getLeaderboard().then((res) => {
      if (res.success && res.data) {
        setLeaderboardData(res.data);
      }
    });
  }, [apiService]);

  /* useEffect(() => {
    ws?.send(`play as ${username}`);
    if (username && ws) {
      const msg = new Uint8Array(1);
      msg[0] = MessageType.JOIN_GAME;
      ws.send(msg);
    }
  }, [ws, username]); */

  return (
    <Provider store={getStore()}>
      {isLoading && (
        <div className={styles.container}>
          <Image
            src="/spinning-circles.svg"
            alt="Spinning indicator"
            width={64}
            height={64}
          />
        </div>
      )}
      {playable ? (
        <PhaserGame />
      ) : (
        <div className={styles.container}>
          <PlayerForm setPlayable={setPlayable} setLoading={setLoading} />
          <Leaderboard data={leaderboardData} />
        </div>
      )}
    </Provider>
  );
};

export default Home;
