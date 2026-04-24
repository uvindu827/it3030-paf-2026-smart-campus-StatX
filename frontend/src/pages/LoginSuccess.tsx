import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const role = params.get('role');
        const userId = params.get("userId");
        const email = params.get("email");

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role || 'ROLE_USER');

            try {
                
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = JSON.parse(window.atob(base64));
                
                const userEmail = decoded.sub || ""; 
                const userName = decoded.name || userEmail.split('@')[0];

                localStorage.setItem('userEmail', userEmail);
                localStorage.setItem('userName', userName);
                
            } catch (error) {
                console.error("Token decoding failed", error);
            }

            if (role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } else {
            navigate('/login');
        }
    }, [navigate, location]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
            <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-lg font-medium">Securing your session...</p>
            </div>
        </div>
    );
};

export default LoginSuccess;