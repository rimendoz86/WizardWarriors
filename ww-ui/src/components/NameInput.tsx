import styles from "./NameInput.module.css";

const NameInput = ({
  setName,
  setLoading,
  setUsername,
  username,
}: {
  setName: Function;
  setLoading: Function;
  setUsername: Function;
  username: string;
}) => {
  const loadGame = () => {
    setName(true);
    setLoading(true);
  };

  return (
    <>
      <input
        className={styles.input}
        placeholder="Enter a player name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className={styles.button}
        aria-label="Play game"
        onClick={loadGame}
        disabled={!username}
      >
        Play game
      </button>
    </>
  );
};

export default NameInput;
