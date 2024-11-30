import { Dispatch, SetStateAction, useState } from "react";
import styles from "./PlayerForm.module.css";
import useApiService from "@hooks/useApiService";

const PlayerForm = ({
  setPlayable,
  setLoading,
}: {
  setPlayable: Dispatch<SetStateAction<boolean | undefined>>;
  setLoading: Dispatch<SetStateAction<boolean | undefined>>;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const apiService = useApiService();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await apiService?.registerUser({ username, password }).then((res) => {
      if (res.success) {
        setPlayable(true);
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        autoComplete="username"
        className={styles.input}
        placeholder="Player name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        autoComplete="password"
        className={styles.input}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className={styles.button}
        aria-label="Play game"
        disabled={!username || !password}
      >
        Play game
      </button>
    </form>
  );
};

export default PlayerForm;
