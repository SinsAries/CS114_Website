import { useState } from 'react';
import Link from 'next/link';
import { Activity, Mail, ArrowLeft, User, Phone, Facebook } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Đánh dấu đã submit form
    setSubmitted(true);
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
            <h2 className="text-3xl font-bold mb-6">Đặt lại mật khẩu</h2>
            <p className="mb-8">Chúng tôi sẽ giúp bạn khôi phục tài khoản và đặt lại mật khẩu để bạn có thể tiếp tục sử dụng dịch vụ của MedPredict.</p>
            
            <div className="mt-auto">
              <h3 className="text-xl font-semibold mb-3">MedPredict</h3>
              <p className="text-blue-100">Sử dụng công nghệ AI tiên tiến để hỗ trợ việc chẩn đoán và phòng ngừa bệnh một cách hiệu quả.</p>
              
              <div className="mt-8 p-4 bg-blue-700 bg-opacity-40 rounded-lg">
                <p className="italic text-sm">"Hệ thống hỗ trợ của MedPredict rất nhanh chóng và hiệu quả, giúp tôi giải quyết vấn đề chỉ trong vài phút."</p>
                <p className="text-right text-sm mt-2">— Lê Thị B, Bệnh nhân</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Reset Password form */}
        <div className="w-full md:w-1/2 p-8">
          <Link href="/login" className="flex items-center text-blue-600 mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Quay lại trang đăng nhập</span>
          </Link>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h1>
            <p className="text-gray-600 mt-2">Chúng tôi sẽ giúp bạn khôi phục tài khoản</p>
          </div>
          
          {!submitted ? (
            <>
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Chức năng đặt lại mật khẩu tự động hiện đang được phát triển. Vui lòng liên hệ với quản trị viên để được hỗ trợ đặt lại mật khẩu.
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email đăng ký tài khoản
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
              
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Gửi yêu cầu hỗ trợ
              </button>
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin liên hệ hỗ trợ</h2>
              
              <p className="text-gray-600 mb-6">
                Vui lòng liên hệ quản trị viên của hệ thống bằng một trong các phương thức sau để được hỗ trợ đặt lại mật khẩu:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Người hỗ trợ</p>
                    <p className="text-gray-600">Nguyễn Trọng Tất Thành</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <a href="mailto:23521455@gm.uit.edu.vn" className="text-blue-600 hover:underline">23521455@gm.uit.edu.vn</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Số điện thoại</p>
                    <a href="tel:0334842058" className="text-blue-600 hover:underline">0334842058</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Facebook className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Facebook</p>
                    <a href="#" className="text-blue-600 hover:underline">Facebook</a>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Khi liên hệ, vui lòng cung cấp địa chỉ email đã đăng ký (<span className="font-medium">{email}</span>) để chúng tôi có thể hỗ trợ bạn nhanh chóng và hiệu quả.
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}