import React from "react";
import { createContext, useState, ReactNode } from "react";
import axios from "axios";

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://dummyjson.com/auth/login", {
        username,
        password,
      });

      const { accessToken, ...userData } = response.data;

      if (accessToken) {
        setUser(userData);
        setToken(accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return { user: userData, token: accessToken };
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      let errorMessage = "Ocorreu um erro durante o login";

      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        console.error("Login error:", error);
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
      console.log(token);
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
