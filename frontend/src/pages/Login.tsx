import React from 'react';

const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <div style={styles.headerSection}>
                    {/* You can replace this with an actual logo image */}
                    <div style={styles.logoCircle}>🎓</div>
                    <h1 style={styles.title}>Smart Campus</h1>
                    <p style={styles.subtitle}>Welcome back! Please sign in to manage your bookings.</p>
                </div>

                <button onClick={handleGoogleLogin} style={styles.googleButton}>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_活跃图标.svg" 
                        alt="Google" 
                        style={styles.googleIcon} 
                    />
                    <span>Continue with Google</span>
                </button>

                <div style={styles.footer}>
                    <p>© 2024 Smart Campus Operation Hub</p>
                </div>
            </div>
        </div>
    );
};

// Modern UI Styles
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5', // Light gray background
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    loginCard: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    headerSection: {
        marginBottom: '30px',
    },
    logoCircle: {
        fontSize: '40px',
        backgroundColor: '#e7f0ff',
        width: '80px',
        height: '80px',
        lineHeight: '80px',
        borderRadius: '50%',
        margin: '0 auto 20px',
    },
    title: {
        fontSize: '28px',
        color: '#1a73e8',
        margin: '0 0 10px 0',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '14px',
        color: '#5f6368',
        lineHeight: '1.5',
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '12px',
        backgroundColor: '#ffffff',
        color: '#3c4043',
        border: '1px solid #dadce0',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        gap: '10px'
    },
    googleIcon: {
        width: '20px',
        height: '20px',
    },
    footer: {
        marginTop: '30px',
        fontSize: '12px',
        color: '#9aa0a6',
    }
};

export default Login;