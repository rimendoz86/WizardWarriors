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

  const disableButton = !username || !password;
  const apiService = useApiService();

  const login = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await apiService?.loginUser({ username, password }).then((res) => {
      if (res.success) {
        setPlayable(true);
      }
    });
  };

  const register = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await apiService?.registerUser({ username, password }).then((res) => {
      if (res.success) {
        setPlayable(true);
      }
    });
  };

  return (
    <form className={styles.form}>
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
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          aria-label="Login"
          disabled={disableButton}
          onClick={login}
        >
          Login
        </button>
        <button
          className={`${styles.button} ${styles.grayButton}`}
          aria-label="Register"
          disabled={disableButton}
          onClick={register}
        >
          Register
        </button>
      </div>
    </form>
  );
};
export default PlayerForm;
