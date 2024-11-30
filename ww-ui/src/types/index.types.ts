export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
