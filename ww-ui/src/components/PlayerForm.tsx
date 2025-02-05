import useApiService from "@hooks/useApiService";
import { useAtom } from "jotai";
import React, { Dispatch, SetStateAction, useState } from "react";
import { gameStatsAtom, setGameSaved } from "src/state";
import { PlayerSaveResponse } from "src/types/index.types";
import styles from "./PlayerForm.module.css";

export const getCookie = (name: string): string => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return "-1";
};

const PlayerForm = ({
  setPlayable,
}: {
  setPlayable: Dispatch<SetStateAction<boolean | undefined>>;
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
  const [_gameStats, setGameStats] = useAtom(gameStatsAtom);

  const login = async (e: React.MouseEvent) => {
    deleteCookie(e, "ww-userId");
    await apiService?.loginUser({ username, password }).then((res) => {
      if (res.success) {
        if (!res.data) handlePlayGame();
        setSaves(res.data);
        setGameStats((prev) => ({
          ...prev,
          user_id: parseInt(getCookie("ww-userId")),
          username,
        }));
      } else {
        setError(res.error || "Error logging in.");
      }
    });
  };

  const register = async (e: React.MouseEvent) => {
    deleteCookie(e, "ww-userId");
    await apiService?.registerUser({ username, password }).then((res) => {
      if (res.success) {
        setPlayable(true);
        setGameStats((prev) => ({
          ...prev,
          user_id: parseInt(getCookie("ww-userId")),
          username: username,
        }));
      } else {
        setError(res.error || "Error registering.");
      }
    });
  };

  const deleteCookie = (event: React.UIEvent, name: string) => {
    event.preventDefault();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  };

  const handleSaveSelection = (save: PlayerSaveResponse) => {
    setSelectedSave(save === selectedSave ? null : save);
  };

  const playGame = () => {
    setPlayable(true);
    setGameSaved(false);
  };

  const handlePlayGame = async () => {
    if (selectedSave) {
      const save = await apiService?.getPlayerSave(selectedSave.game_id);
      if (save?.data?.is_game_over || !save?.data?.game_is_active) {
        alert("This save is no longer playable.");
        return;
      }
      setGameStats({
        game_id: save.data.game_id,
        username,
        user_id: save.data.user_id,
        team_deaths: save.data.team_deaths,
        team_kills: save.data.team_kills,
        player_level: save.data.player_level,
        player_kills: save.data.player_kills,
        player_kills_at_level: save.data.player_kills_at_level,
        total_allies: save.data.total_allies,
        total_enemies: save.data.total_enemies,
        is_game_over: save.data.is_game_over,
        game_created_at: save.data.game_created_at,
        game_updated_at: save.data.game_updated_at,
      });
    }
    playGame();
  };

  if (saves) {
    return (
      <div className={styles.savesContainer}>
        <h2>Player Saves</h2>
        <div className={styles.savesGrid}>
          {saves.map((save) => {
            const isDisabled = !save.game_is_active || save.is_game_over;

            return (
              <div
                key={save.game_id}
                className={`${styles.save} ${selectedSave?.game_id === save.game_id ? styles.selectedSave : ""} ${
                  isDisabled ? styles.disabledSave : ""
                }`}
                onClick={() => {
                  if (!isDisabled) handleSaveSelection(save);
                }}
              >
                <p>Game ID: {save.game_id}</p>
                <p>
                  User ID: <span className={styles.value}>{save.user_id}</span>
                </p>
                <p>
                  Total Kills:{" "}
                  <span className={styles["max-level"]}>
                    {save.player_kills}
                  </span>
                </p>
                <p>
                  Total Allies:{" "}
                  <span className={styles["max-level"]}>
                    {save.total_allies}
                  </span>
                </p>
                <p>
                  Total Enemies:{" "}
                  <span className={styles["max-level"]}>
                    {save.total_enemies}
                  </span>
                </p>
                <p className={styles.gameOver}>
                  Game Over:{" "}
                  <span
                    className={
                      save.is_game_over ? styles.gameOverYes : styles.gameOverNo
                    }
                  >
                    {save.is_game_over ? "Yes" : "No"}
                  </span>
                </p>
                <p>Created: {new Date(save.created_at).toLocaleString()}</p>
                <p>Updated: {new Date(save.updated_at).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.grayButton}`}
            onClick={() => setSaves(undefined)}
          >
            Back
          </button>
          <button className={styles.button} onClick={() => handlePlayGame()}>
            {selectedSave ? "Continue" : "Start New Game"}
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
