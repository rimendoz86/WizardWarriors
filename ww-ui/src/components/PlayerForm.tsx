import { Dispatch, SetStateAction, useState } from "react";
import styles from "./PlayerForm.module.css";
import useApiService from "@hooks/useApiService";
import { PlayerSaveResponse } from "src/types/index.types";

const PlayerForm = ({
  setPlayable,
  setLoading,
}: {
  setPlayable: Dispatch<SetStateAction<boolean | undefined>>;
  setLoading: Dispatch<SetStateAction<boolean | undefined>>;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [saves, setSaves] = useState<PlayerSaveResponse[] | undefined>(
    undefined
  );
  const [selectedSave, setSelectedSave] = useState<PlayerSaveResponse | null>(
    null
  );
  const disableButton = !username || !password;
  const apiService = useApiService();

  const login = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await apiService?.loginUser({ username, password }).then((res) => {
      setLoading(false);
      if (res.success) {
        if (!res.data) handlePlayGame(true);
        setSaves(res.data);
      } else {
        setError(res.error || "Error logging in.");
      }
    });
  };

  const register = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await apiService?.registerUser({ username, password }).then((res) => {
      setLoading(false);
      if (res.success) {
        setPlayable(true);
      }
    });
  };

  const handleSaveSelection = (save: PlayerSaveResponse) => {
    setSelectedSave(save === selectedSave ? null : save);
  };

  const playGame = () => {
    setLoading(true);
    setPlayable(true);
  };

  const handlePlayGame = (forceStart: boolean) => {
    if (forceStart) {
      playGame();
    }

    if (selectedSave) {
      // TODO: Should we store this in a cookie or session storage?
      sessionStorage.setItem(
        "playerGameStats",
        JSON.stringify({
          userId: selectedSave.user_id,
          saveId: selectedSave.id,
          maxLevel: selectedSave.max_level,
          createdAt: selectedSave.created_at,
          updatedAt: selectedSave.updated_at,
        })
      );
      playGame();
    }
  };

  if (saves) {
    return (
      <div className={styles.savesContainer}>
        <h2>Player Saves</h2>
        <div className={styles.savesGrid}>
          {saves.map((save) => (
            <div
              key={save.id}
              className={`${styles.save} ${selectedSave?.id === save.id ? styles.selectedSave : ""}`}
              onClick={() => handleSaveSelection(save)}
            >
              <p>Save ID: {save.id}</p>
              <p>
                User ID: <span className={styles.value}>{save.user_id}</span>
              </p>
              <p>
                Max Level:{" "}
                <span className={styles["max-level"]}>{save.max_level}</span>
              </p>
              <p>Created: {new Date(save.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(save.updated_at).toLocaleString()}</p>
              <p>Active: {save.is_active ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.grayButton}`}
            onClick={() => setSaves(undefined)}
          >
            Back
          </button>
          <button
            className={`${styles.button} ${!selectedSave ? styles.grayButton : ""}`}
            onClick={() => handlePlayGame(false)}
            disabled={!selectedSave}
          >
            Play
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form}>
      <div className={styles.errorContainer}>
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <input
        autoComplete="username"
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        placeholder="Player name"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          if (error) setError("");
        }}
      />
      <input
        autoComplete="password"
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (error) setError("");
        }}
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
