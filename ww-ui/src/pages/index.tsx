import dynamic from "next/dynamic";
import { NextPage } from "next/types";
import { useState } from "react";
/* import { MessageType } from "src/rpc/api/proto/ipc_pb"; */
import Image from "next/image";
import NameInput from "src/components/NameInput";
import styles from "../styles/index.module.css";

const Home: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>();
  /* const { ws } = useSocket(); */

  const PhaserGame = dynamic(
    () => import("../game/app").finally(() => setLoading(false)),
    { ssr: false }
  );

  /* useEffect(() => {
    ws?.send(`play as ${username}`);
    if (username && ws) {
      const msg = new Uint8Array(1);
      msg[0] = MessageType.JOIN_GAME;
      ws.send(msg);
    }
  }, [ws, username]); */

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
          <NameInput
            setName={setName}
            setLoading={setLoading}
            setUsername={setUsername}
            username={username}
          />
        </div>
      )}
    </>
  );
};

export default Home;
