import dynamic from "next/dynamic";
import Image from "next/image";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";

const Game: NextPage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  const PhaserGame = dynamic(
    () => import("../game").finally(() => setLoading(false)),
    {
      ssr: false,
    }
  );

  return isLoading ? (
    <Image
      src="/spinning-circles.svg"
      alt="spinning-circles loader"
      width="64"
      height="64"
    />
  ) : (
    <PhaserGame />
  );
};

export default Game;
