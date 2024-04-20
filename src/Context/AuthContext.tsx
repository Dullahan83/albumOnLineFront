import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MyJwtPayload, useAuth } from "../Hooks/useAuth";
import { getPictures } from "../component/Utils/func";
// import { useLocation } from "react-router-dom";

export interface Image {
  id: number;
  date: {
    date: string;
    year: number;
  };
  keyword: Array<{ word: string }>;
  legend: string;
  url: string;
  user: {
    id: number;
    name: string;
    validated: boolean;
  };
}

interface User {
  userId: number;
  authorized: boolean;
  // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
}

interface AuthState {
  token: string | null;
  user: User | undefined;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
  isLoadings: boolean;
  isLoading: boolean;

  data: Image[];
  mockupData: Image[];
  currentAlbum: string;
  setCurrentAlbum: React.Dispatch<React.SetStateAction<string>>;
  albumList: Album[];
  setAlbumList: React.Dispatch<React.SetStateAction<Album[]>>;
}

const defaultState: AuthState = {
  token: null,
  user: undefined,
};

const mockupData = [
  {
    id: 1,
    date: {
      date: "1982-01-01T00:00:00.000Z",
      year: 2023,
    },
    keyword: [
      { word: "landscape" },
      { word: "lake" },
      { word: "mountain" },
      { word: "sunrise" },
    ],
    legend: "A breathtaking view of a serene lake at sunrise.",
    url: "HomeImg.webp",
    user: { id: 1, name: "John Doe", validated: true },
  },
];

const AuthContext = createContext<AuthContextType>({
  authState: defaultState,
  setAuthState: () => {},
  isLoadings: true,
  isLoading: false,
  data: [],
  mockupData: mockupData,
  currentAlbum: "",
  setCurrentAlbum: () => "",
  albumList: [],
  setAlbumList: () => [],
});

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];
export type Album = {
  albumId: string;
  name: string;
  homeUrl: string;
};
const getAlbumIdFromUrl = () => {
  const path = window.location.pathname;
  // Cette regex capture une chaîne de 36 caractères (UUID) juste après "/album/"
  const match = path.match(
    /\/album\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/
  );
  return match ? match[1] : null;
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultState);
  const { logout } = useAuth();
  const { user } = authState;
  const [isLoadings, setIsLoadings] = useState(true);
  const [currentAlbum, setCurrentAlbum] = useState<string | null>(null);
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const timerRef = useRef<number>();
  const { data, isLoading } = useQuery({
    queryKey: ["album", currentAlbum],
    queryFn: () => getPictures(currentAlbum),
    enabled:
      user &&
      !isLoadings &&
      currentAlbum !== "" &&
      user?.authorized[currentAlbum]?.validated
        ? true
        : false,
    refetchInterval: 5 * 60 * 1000,
  });

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  // this function sets the timer that logs out the user after xx secs
  const handleLogoutTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logout();
    }, 2 * 60 * 60 * 1000); // Every 2 hours.
  }, [logout, resetTimer]);

  // Add listener to check if user interact with the window, log him out if not
  useEffect(() => {
    if (!currentAlbum) return;
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
    return () =>
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
  }, [handleLogoutTimer, resetTimer, currentAlbum]);

  useEffect(() => {
    const id = getAlbumIdFromUrl();
    id && setCurrentAlbum(id);
  }, []);

  // Use values from storage to achieve data persistance
  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const currAlbum = sessionStorage.getItem("currAlbum");
    if (storedToken === "undefined" || storedToken === undefined) {
      sessionStorage.removeItem("authToken");
      return;
    }
    if (currAlbum && currAlbum !== "undefined") {
      setCurrentAlbum(currAlbum);
    }
    const listAlbum = sessionStorage.getItem("albumList");
    if (listAlbum) {
      setAlbumList(JSON.parse(listAlbum));
    }
    if (storedToken) {
      const decodedUser = jwtDecode<MyJwtPayload>(storedToken);
      if (decodedUser.exp * 1000 <= Date.now()) {
        logout();
        return;
      }
      setAuthState({
        token: storedToken,
        user: {
          userId: decodedUser.userId,
          authorized: decodedUser.authorized,
        },
      });
    }
    setIsLoadings(false);
    document.oncontextmenu = () => {
      return false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        isLoadings,
        isLoading,
        data,
        mockupData,
        currentAlbum,
        setCurrentAlbum,
        albumList,
        setAlbumList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
