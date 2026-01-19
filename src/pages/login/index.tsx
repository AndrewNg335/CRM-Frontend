import { useState } from "react";
import { useLogin } from "@refinedev/core";
export const Login = () => {
    const { mutate: login, isLoading } = useLogin();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false
    });
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});
    const [loginError, setLoginError] = useState<string>("");
    const validateForm = () => {
        const newErrors: {
            [key: string]: string;
        } = {};
        if (!formData.email) {
            newErrors.email = "Vui lòng nhập email!";
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ!";
        }
        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu!";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setLoginError(""); 
            login(formData, {
                onError: (error) => {
                    setLoginError("");
                }
            });
        }
    };
    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
        if (loginError) {
            setLoginError("");
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 text-slate-800">
            Chào Mừng Bạn Quay Trở Lại
          </h1>
          <p className="text-slate-600 text-sm">
            Đăng nhập vào hệ thống CRM
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white/80 text-slate-800 placeholder-slate-500 focus:outline-none transition-all duration-200 ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-slate-300 hover:border-slate-400 focus:border-blue-500'}`} placeholder="Nhập email của bạn"/>
              </div>
              {errors.email && (<p className="mt-1 text-sm text-red-500">{errors.email}</p>)}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-white/80 text-slate-800 placeholder-slate-500 focus:outline-none transition-all duration-200 ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-300 hover:border-slate-400 focus:border-blue-500'}`} placeholder="Nhập mật khẩu của bạn"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-400 transition-colors bg-white/80 rounded-r-lg">
                  {showPassword ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                    </svg>) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>)}
                </button>
              </div>
              {errors.password && (<p className="mt-1 text-sm text-red-500">{errors.password}</p>)}
            </div>

            <div className="flex items-center">
              <input id="remember" type="checkbox" checked={formData.remember} onChange={(e) => handleInputChange("remember", e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded bg-white/80"/>
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex justify-center items-center shadow-lg hover:shadow-xl disabled:shadow-lg">
              {isLoading ? (<div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </div>) : (<div className="text-white">
                  Đăng nhập
                </div>)}
            </button>
          </form>
        </div>
      </div>
    </div>);
};