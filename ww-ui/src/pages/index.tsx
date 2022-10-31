import useWebSocket from "@hooks/useWebSocket";
import dynamic from "next/dynamic";
import Image from "next/image";
import { NextPage } from "next/types";
import { useState } from "react";
import NameInput from "src/components/NameInput";
import styles from "../styles/index.module.css";

const Home: NextPage = () => {
  const [name, setName] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>();
  useWebSocket();

  const PhaserGame = dynamic(
    () => import("../game/app").finally(() => setLoading(false)),
    { ssr: false }
  );

  return (
    <>
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
      {name && <PhaserGame />}
      {!name && (
        <div className={styles.container}>
          <NameInput setName={setName} setLoading={setLoading} />
        </div>
      )}
    </>
  );
};

export default Home;
