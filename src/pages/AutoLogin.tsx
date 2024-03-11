// AutoLogin.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';

const AutoLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { autoLogin } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            autoLogin(token);
            navigate('/'); // Redirect to homepage
        }
    }, [location, autoLogin, navigate]);

    return <div>Connexion en cours...</div>;
};

export default AutoLogin