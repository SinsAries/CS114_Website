import { useState } from 'react';
import Link from 'next/link';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Lấy users đã lưu (nếu có)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Tìm user trùng email và password và loại tài khoản (bác sĩ/bệnh nhân)
    const user = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.isDoctor === isDoctor
    );
    if (!user) {
      setError('Sai tài khoản hoặc mật khẩu, hoặc loại tài khoản không đúng.');
      return;
    }

    // Đăng nhập thành công: lưu vào localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    setSuccess('Đăng nhập thành công!');
    setError('');
    
    // Chuyển hướng, ví dụ:
    // Nếu là bác sĩ, chuyển tới dashboard bác sĩ, nếu bệnh nhân thì chuyển tới symptominput
    if (isDoctor) {
      window.location.href = '/doctor/dashboard'; // hoặc dùng router.push nếu bạn xài Next.js Router
    } else {
      window.location.href = '/symptominput';
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center cursor-pointer">
        <Activity className="h-8 w-8 text-blue-600 mr-2" />
        <span className="text-xl font-bold text-gray-800">MedPredict</span>
      </Link>

      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left side - Image and info */}
        <div className="hidden md:block md:w-1/2 bg-blue-600 text-white p-8 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute bottom-40 right-10 w-28 h-28 rounded-full bg-white"></div>
            <div className="absolute top-48 right-16 w-20 h-20 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-6">Chào mừng trở lại!</h2>
            <p className="mb-8">Đăng nhập để sử dụng các tính năng của hệ thống dự đoán bệnh thông minh.</p>
            
            <div className="mt-auto">
              <h3 className="text-xl font-semibold mb-3">MedPredict</h3>
              <p className="text-blue-100">Sử dụng công nghệ AI tiên tiến để hỗ trợ việc chẩn đoán và phòng ngừa bệnh một cách hiệu quả.</p>
              
              <div className="mt-8 p-4 bg-blue-700 bg-opacity-40 rounded-lg">
                <p className="italic text-sm">"Hệ thống MedPredict giúp tôi tiết kiệm thời gian và đưa ra các chẩn đoán chính xác hơn cho bệnh nhân."</p>
                <p className="text-right text-sm mt-2">— TS. Nguyễn Văn A</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
            <p className="text-gray-600 mt-2">Nhập thông tin đăng nhập của bạn để tiếp tục</p>
          </div>

          {error && (
            <div className="text-center text-red-600 font-medium mb-4">{error}</div>
          )}
          {success && (
            <div className="text-center text-green-600 font-medium mb-4">{success}</div>
          )}
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg overflow-hidden">
              <button
                className={`px-4 py-2 text-sm font-medium ${!isDoctor ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => setIsDoctor(false)}
              >
                Bệnh nhân
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${isDoctor ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => setIsDoctor(true)}
              >
                Bác sĩ
              </button>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <Link href="/resetpasswordpage" className="text-sm text-blue-600 hover:text-blue-800">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đăng nhập
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}