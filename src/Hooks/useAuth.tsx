        import { useContext, useState, useCallback, useEffect } from 'react';
        import {jwtDecode, JwtPayload} from "jwt-decode";
        import AuthContext from '../Context/AuthContext';
        import { useNavigate } from 'react-router-dom';

        interface LoginResponse {
            token: string;
        }
        type loginQueryProps = {
            email: string, password: string
        }

        type signupQueryProps = {
            name: string, email: string, password: string
        }
        export interface MyJwtPayload extends JwtPayload {
            userId: number;
            authorized: boolean;
        }
        export const useAuth = () => {
            const { authState, setAuthState } = useContext(AuthContext);
            const navigate = useNavigate()
            const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

            useEffect(() => {
                if(token === undefined || token === "undefined") return
                if (token) {
                    const decodedUser = jwtDecode<MyJwtPayload>(token)
                    const {userId, authorized} = decodedUser
                    setAuthState({ token, user: {userId: userId, authorized: authorized} });
                }
                else setAuthState({token: null, user: undefined})
            }, [token, setAuthState]);

            const login = useCallback(async (body: loginQueryProps) => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    const data: LoginResponse = await response.json();
                    if (!response.ok) {
                        throw new Error(data.token || 'Échec de la connexion');
                    }
                    setToken(data.token);
                    localStorage.setItem('authToken', data.token);
                } catch (error) {
                    console.error('Erreur de connexion:', error);
                }
            }, []);

            const signup = useCallback(async (body: signupQueryProps) => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.token || 'Échec de la connexion');
                    }
                } catch (error) {
                    console.error('Erreur de connexion:', error);
                }
            }, []);
            
            const logout = useCallback(() => {
                setToken(null);
                localStorage.removeItem('authToken');
                setAuthState({ token: null, user: undefined });
                // navigate("/")
                window.location.pathname = "/"
            }, [setAuthState, navigate]);

            const autoLogin = useCallback(async (autoLoginToken: string) => {
                try {
                    // Envoyez une requête d'auto-login à votre serveur
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/autoLogin?token=${autoLoginToken}`);
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.message || 'Échec de l\'auto-login');
                    }
                    if(data){
                        setToken(data.token);
                        localStorage.setItem('authToken', data.token);
                        const decodedUser = jwtDecode<MyJwtPayload>(data.token)
                        const {userId, authorized} = decodedUser
                        setAuthState({ token, user: {userId: userId, authorized: authorized} });
                    }
                } catch (error: unknown) {
                    console.error(error);
                }
            }, []);

            const checkTokenExpiration = useCallback(() => {
                if(token === undefined ||token === "undefined") return
                if (token) {
                    const decodedToken = jwtDecode<MyJwtPayload>(token);
                    if(decodedToken.exp){
                        const isExpired = decodedToken.exp * 1000 < Date.now();
                        if (isExpired) {
                            logout();
                        }
                    }
                }
            }, [token, logout]);

            return { ...authState, login, logout, signup, autoLogin, checkTokenExpiration };
        };
