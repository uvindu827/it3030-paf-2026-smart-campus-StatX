import React from 'react';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    // Background with a modern Mesh Gradient
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* Decorative Blur Blobs for "Colorful" look */}
      <div className="absolute top-0 -left-4 h-72 w-72 animate-blob rounded-full bg-blue-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
      <div className="absolute top-0 -right-4 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
      <div className="absolute -bottom-8 left-20 h-72 w-72 animate-blob animation-delay-4000 rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-md transform rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl transition-all hover:scale-[1.01]">
        
        {/* HEADER SECTION */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 text-4xl shadow-lg shadow-blue-500/30">
            <span className="drop-shadow-md text-white">🎓</span>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight text-white">
            Smart<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Campus</span>
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-400">
            Experience the future of campus management.
          </p>
        </div>

        {/* GOOGLE BUTTON */}
        <div className="group relative">
          {/* Glowing effect behind button */}
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur transition duration-200 group-hover:opacity-100"></div>
          
          <button 
            onClick={handleGoogleLogin} 
            className="relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-base font-bold text-slate-900 transition-all active:scale-95"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="h-5 w-5" 
            />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* DIVIDER */}
        <div className="my-10 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* INFO PILLS */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Fast</p>
            <p className="text-xs text-white">One-Click Entry</p>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Secure</p>
            <p className="text-xs text-white">OAuth 2.0</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Powered by Smart Campus Operations
        </div>
      </div>
    </div>
  );
};

export default Login;