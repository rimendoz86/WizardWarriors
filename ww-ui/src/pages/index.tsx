import { NextPage } from "next/types";
import { lazy, Suspense, useEffect, useState } from "react";
/* import { MessageType } from "src/rpc/api/proto/ipc_pb"; */
import useApiService from "@hooks/useApiService";
import Image from "next/image";
import Leaderboard from "src/components/Leaderboard";
import PlayerForm from "src/components/PlayerForm";
import { GameStatsResponse } from "src/types/index.types";
import styles from "../styles/index.module.css";

const Home: NextPage = () => {
  const [playable, setPlayable] = useState<boolean>();
  const [leaderboardData, setLeaderboardData] = useState<GameStatsResponse[]>(
    []
  );

  const apiService = useApiService();

  const PhaserGame = lazy(() => import("../game/app"));

  useEffect(() => {
    if (!apiService) return;

    const fetchLeaderboard = async () => {
      const res = await apiService.getLeaderboard();
      if (res.success && res.data) {
        setLeaderboardData(res.data);
      }
    };

    fetchLeaderboard();
  }, [apiService]);

  return (
    <>
      {playable ? (
        <Suspense
          fallback={
            <div className={styles.container}>
              <Image
                src="/spinning-circles.svg"
                alt="Spinning indicator"
                width={64}
                height={64}
              />
            </div>
          }
        >
          <PhaserGame />
        </Suspense>
      ) : (
        <div className={styles.container}>
          <PlayerForm setPlayable={setPlayable} />
          <Leaderboard data={leaderboardData} />
        </div>
      )}
    </>
  );
};

export default Home;
