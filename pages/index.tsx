import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search, Activity, Heart, Shield, User, ArrowRight } from 'lucide-react';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null); // Đổi thành user object
  const router = useRouter();

  // Kiểm tra trạng thái đăng nhập khi vừa load trang
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('loggedInUser');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  // Hàm xử lý khi bấm "bắt đầu" hoặc "dự đoán"
  const handleStart = () => {
    if (user) {
      router.push('/symptominput');
    } else {
      router.push('/login');
    }
  };

  // Hàm logout (nếu có)
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">MedPredict</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-blue-600 font-medium">Trang chủ</Link>
            <button
              onClick={handleStart}
              className="text-gray-600 hover:text-blue-600 bg-transparent border-0 outline-none cursor-pointer"
            >
              Dự đoán
            </button>
            <Link href="/info" className="text-gray-600 hover:text-blue-600">Thông tin</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Liên hệ</Link>
          </nav>
          {/* Nếu đã đăng nhập thì hiện tên + nút đăng xuất, chưa thì hiện nút đăng nhập */}
          {user ? (
            <div className="flex items-center gap-2">
              <User size={18} className="mr-1 text-blue-600" />
              <span className="font-medium text-gray-800">{user.fullName || user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 ml-2"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                <User size={18} className="mr-2" />
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hệ thống dự đoán bệnh thông minh
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sử dụng công nghệ AI tiên tiến để phân tích triệu chứng và cung cấp đánh giá sớm về tình trạng sức khỏe của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleStart}
            >
              Bắt đầu ngay
              <ArrowRight size={20} className={`ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
            <Link href="/info">
              <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Tìm hiểu thêm
              </button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -left-4 -top-4 w-64 h-64 bg-blue-100 rounded-full opacity-70"></div>
            <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-green-100 rounded-full opacity-70"></div>
            <div className="bg-white shadow-xl rounded-2xl p-6 relative z-10">
              <img 
                src="/api/placeholder/500/400" 
                alt="Medical AI Illustration" 
                className="w-full rounded-lg mb-4" 
              />
              <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                <Search className="text-blue-600 w-10 h-10 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">Tìm kiếm triệu chứng</h3>
                  <p className="text-gray-600">Nhập các triệu chứng của bạn để bắt đầu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phân tích chính xác</h3>
              <p className="text-gray-600">Sử dụng thuật toán AI để phân tích dựa trên các triệu chứng và cung cấp kết quả dự đoán chính xác.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bảo mật thông tin</h3>
              <p className="text-gray-600">Dữ liệu của bạn được mã hóa và bảo vệ an toàn, đảm bảo quyền riêng tư tối đa.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Theo dõi sức khỏe</h3>
              <p className="text-gray-600">Lưu lại lịch sử kiểm tra và nhận thông báo về các khuyến nghị chăm sóc sức khỏe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-600 text-white p-8 md:p-12 rounded-2xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng kiểm tra sức khỏe của bạn?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Chỉ mất vài phút để hoàn thành đánh giá và nhận phân tích chi tiết về tình trạng sức khỏe của bạn.
          </p>
          <button
            onClick={handleStart}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-50 transition-colors"
          >
            Bắt đầu đánh giá miễn phí
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-lg font-bold">MedPredict</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4 md:mb-0">
              <Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link>
              <Link href="/symptominput" className="text-gray-300 hover:text-white">Dự đoán</Link>
              <Link href="/info" className="text-gray-300 hover:text-white">Thông tin</Link>
              {!user && (
                <>
                  <Link href="/register" className="text-gray-300 hover:text-white">Đăng ký</Link>
                  <Link href="/login" className="text-gray-300 hover:text-white">Đăng nhập</Link>
                </>
              )}
              {user?.isDoctor && (
                <Link href="/doctordashboard" className="text-gray-300 hover:text-white">Bác sĩ</Link>
              )}
            </div>
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} MedPredict. Tất cả các quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </main>
  );
}