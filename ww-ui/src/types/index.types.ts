export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  token?: string;
}

export interface GameStatsResponse {
  id: number;
  username: string;
  user_id: number;
  team_deaths: number;
  team_kills: number;
  player_level: number;
  player_kills: number;
  player_kills_at_level: number;
  total_allies: number;
  total_enemies: number;
  is_game_over: boolean;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
