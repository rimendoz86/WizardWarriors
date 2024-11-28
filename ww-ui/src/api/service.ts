import {
  ApiResponse,
  UserCredentials,
  UserResponse,
} from "src/types/index.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

class ApiService {
  private baseUrl = BASE_URL;

  async registerUser(
    credentials: UserCredentials
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await fetch(this.baseUrl + "/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const result: ApiResponse<UserResponse> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register user.");
      }

      return result;
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  async loginUser(
    credentials: UserCredentials
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await fetch(this.baseUrl + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const result: ApiResponse<UserResponse> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to login user.");
      }

      return result;
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiResponse<UserResponse> {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    } else {
      return {
        success: false,
        error: "Unexpected error occurred.",
      };
    }
  }
}

export default ApiService;