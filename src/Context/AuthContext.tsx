import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { ReactNode, createContext, useEffect, useState } from "react";
import { MyJwtPayload, useAuth } from "../Hooks/useAuth";
import { getPictures } from "../component/Utils/func";
// import { useLocation } from "react-router-dom";

export interface Image {
  id: number;
  date: {
    date: string;
    year: number;
  };
  keywords: Array<{ word: string }>;
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
    keywords: [
      { word: "landscape" },
      { word: "lake" },
      { word: "mountain" },
      { word: "sunrise" },
    ],
    legend: "A breathtaking view of a serene lake at sunrise.",
    url: "mockImage1.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 2,
    date: {
      date: "1996-01-01T00:00:00.000Z",
      year: 2023,
    },
    keywords: [
      { word: "cityscape" },
      { word: "night" },
      { word: "skyscrapers" },
      { word: "neon" },
    ],
    legend: "The bustling energy of a city at night.",
    url: "mockImage2.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 3,
    date: {
      date: "1927-01-01T00:00:00.000Z",
      year: 2023,
    },
    keywords: [
      { word: "portrait" },
      { word: "fashion" },
      { word: "urban" },
      { word: "futuristic" },
    ],
    legend: "A fashion-forward portrait .",
    url: "mockImage3.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 4,
    date: {
      date: "2023-01-01T00:00:00.000Z",
      year: 2000,
    },
    keywords: [
      { word: "surreal" },
      { word: "clock" },
      { word: "abstract" },
      { word: "sky" },
    ],
    legend: "",
    url: "mockImage4.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 5,
    date: {
      date: "2016-01-01T00:00:00.000Z",
      year: 2006,
    },
    keywords: [
      { word: "beach" },
      { word: "sunset" },
      { word: "hammock" },
      { word: "tranquility" },
    ],
    legend: "",
    url: "mockImage5.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 6,
    date: {
      date: "2018-01-01T00:00:00.000Z",
      year: 1924,
    },
    keywords: [
      { word: "abstract" },
      { word: "geometric" },
      { word: "colorful" },
      { word: "dynamic" },
    ],
    legend: "",
    url: "mockImage6.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 7,
    date: {
      date: "2023-01-01T00:00:00.000Z",
      year: 1952,
    },
    keywords: [
      { word: "butterfly" },
      { word: "flower" },
      { word: "close-up" },
      { word: "garden" },
    ],
    legend: "",
    url: "mockImage7.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 8,
    date: {
      date: "2018-01-01T00:00:00.000Z",
      year: 1967,
    },
    keywords: [
      { word: "sports" },
      { word: "soccer" },
      { word: "action" },
      { word: "stadium" },
    ],
    legend: "",
    url: "mockImage8.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 9,
    date: {
      date: "1998-01-01T00:00:00.000Z",
      year: 2000,
    },
    keywords: [
      { word: "vintage" },
      { word: "cat" },
      { word: "elegant" },
      { word: "monocle" },
    ],
    legend: "",
    url: "mockImage9.png",
    user: { id: 1, name: "John Doe", validated: true },
  },
  {
    id: 10,
    date: {
      date: "1986-01-01T00:00:00.000Z",
      year: 1995,
    },
    keywords: [
      { word: "winter" },
      { word: "town" },
      { word: "snow" },
      { word: "festive" },
    ],
    legend: "",
    url: "mockImage10.png",
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
});

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultState);
  const { logout } = useAuth();
  // const {pathname} = useLocation()
  const { user } = authState;
  const [isLoadings, setIsLoadings] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["album"],
    queryFn: getPictures,
    enabled: !isLoadings && user?.authorized ? true : false,
    refetchInterval: 5 * 60 * 1000,
  });

  let timer;

  // this function sets the timer that logs out the user after xx secs
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logout();
    }, 2 * 60 * 60 * 1000); // Every 2 hours. You can change the time.
  };
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken === "undefined" || storedToken === undefined) {
      localStorage.removeItem("authToken");
      return;
    }

    if (storedToken) {
      const decodedUser = jwtDecode<MyJwtPayload>(storedToken);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
