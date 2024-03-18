import { useQueryClient } from "@tanstack/react-query";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { Album } from "../Context/AuthContext";

interface LoginResponse {
  token: string;
  albumArray: Album[];
}
type loginQueryProps = {
  email: string;
  password: string;
};

type signupQueryProps = {
  albumId: string;
  name: string;
  email: string;
  password: string;
};
export interface MyJwtPayload extends JwtPayload {
  userId: number;
  authorized: boolean;
}
export const useAuth = () => {
  const { authState, setAuthState, setAlbumList, setCurrentAlbum } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    if (token === undefined || token === "undefined") return;
    if (token) {
      const decodedUser = jwtDecode<MyJwtPayload>(token);
      const { userId, authorized } = decodedUser;
      setAuthState({ token, user: { userId: userId, authorized: authorized } });
    } else setAuthState({ token: null, user: undefined });
  }, [token, setAuthState]);

  const login = useCallback(async (body: loginQueryProps) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data: LoginResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.token || "Échec de la connexion");
      }
      setToken(data.token);
      localStorage.setItem("authToken", data.token);
      if (data.albumArray.length > 1) {
        sessionStorage.setItem("albumList", JSON.stringify(data.albumArray));
        setAlbumList(data.albumArray);
        navigate("/albumChoice");
        return;
      }
      setCurrentAlbum(data.albumArray[0].albumId);
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  }, []);

  const signup = useCallback(async (body: signupQueryProps) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.token || "Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("albumList");
    setAuthState({ token: null, user: undefined });
    setAlbumList([]);
    navigate("/");
    // window.location.pathname = "/";
    queryClient.invalidateQueries({ queryKey: ["album"] });
  }, [setAuthState, setAlbumList, navigate, queryClient]);

  const autoLogin = useCallback(async (autoLoginToken: string) => {
    try {
      // Envoyez une requête d'auto-login à votre serveur
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/auth/autoLogin?token=${autoLoginToken}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Échec de l'auto-login");
      }
      if (data) {
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        const decodedUser = jwtDecode<MyJwtPayload>(data.token);
        const { userId, authorized } = decodedUser;
        setAuthState({
          token,
          user: { userId: userId, authorized: authorized },
        });
      }
    } catch (error: unknown) {
      console.error(error);
    }
  }, []);

  const checkTokenExpiration = useCallback(() => {
    if (token === undefined || token === "undefined") return;
    if (token) {
      const decodedToken = jwtDecode<MyJwtPayload>(token);
      if (decodedToken.exp) {
        const isExpired = decodedToken.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        }
      }
    }
  }, [token, logout]);

  return {
    ...authState,
    login,
    logout,
    signup,
    autoLogin,
    checkTokenExpiration,
  };
};
