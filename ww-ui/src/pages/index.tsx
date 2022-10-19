import Link from "next/link";
import { NextPage } from "next/types";

const Home: NextPage = () => {
  return (
    <Link href="/game">
      <a>Play game</a>
    </Link>
  );
};

export default Home;
