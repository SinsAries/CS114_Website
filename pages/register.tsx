import { useState } from 'react';
import Link from 'next/link';
import { Activity, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    // Lấy danh sách user đã có
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        setError('Email này đã được đăng ký!');
        return;
    }
    // Thêm user mới
    users.push({ fullName, email, password, isDoctor: false });
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');

    // Reset form
    setFullName('');
    setEmail('');
    setPassword('');
    // Tự động chuyển sang trang login sau 1-2 giây (tùy thích)
    setTimeout(() => {
        window.location.href = '/login';
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center cursor-pointer">
        <Activity className="h-8 w-8 text-blue-600 mr-2" />
        <span className="text-xl font-bold text-gray-800">MedPredict</span>
      </Link>

      <div className="w-full max-w-2xl flex rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div className="w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Đăng ký bệnh nhân</h1>
            <p className="text-gray-600 mt-2">Tạo tài khoản để sử dụng hệ thống MedPredict</p>
          </div>

          {error && (
            <div className="text-center text-red-600 font-medium mt-2">{error}</div>
          )}
          {success && (
            <div className="text-center text-green-600 font-medium mt-2">{success}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullname"
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đăng ký
            </button>

            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Đăng nhập</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
