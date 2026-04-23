import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const role = params.get('role'); // Capture role from URL

        if (token) {
            // Save both for future use
            localStorage.setItem('token', token);
            localStorage.setItem('role', role || 'ROLE_USER');
            
            console.log('Logged in as:', role);

            // Conditional Navigation
            if (role === 'ROLE_ADMIN') {
                navigate('/admin'); // Admin goes to Dashboard
            } else {
                navigate('/home');  // Regular user goes to Home
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