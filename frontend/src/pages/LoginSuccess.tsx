import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if(token) {
            localStorage.setItem('token', token);
            console.log('Login successful! Token saved');
            navigate('/');
        }else {
            navigate('/login');
        }
    }, [navigate, location]);

    return <div>Processing Login...</div>;
};

export default LoginSuccess;