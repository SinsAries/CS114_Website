import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Activity, User, BookOpen, Code, Server, Cloud, Users, Award } from 'lucide-react';

export default function InfoPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Lấy user đang đăng nhập từ localStorage (nếu có)
    if (typeof window !== "undefined") {
      const u = localStorage.getItem('loggedInUser');
      if (u) setUser(JSON.parse(u));
    }
  }, []);


  const handleStart = () => {
    if (user) {
        router.push('/symptominput');
    } else {
        router.push('/login');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">MedPredict</span>
          </a>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Trang chủ</Link>
            <button
              onClick={handleStart}
              className="text-gray-600 hover:text-blue-600 bg-transparent border-0 outline-none cursor-pointer"
            >
              Dự đoán
            </button>
            <Link href="/info" className="text-blue-600 font-medium">Thông tin</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Liên hệ</Link>
          </nav>
          {user ? (
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center font-semibold">
                <User size={18} className="mr-2" />
                Xin chào, {user.fullName || "Người dùng"}!
                <button
                className="ml-3 text-red-500 underline hover:text-red-700"
                onClick={() => {
                    localStorage.removeItem('loggedInUser');
                    setUser(null);
                    router.push('/login');
                }}
                >
                Đăng xuất
                </button>
            </span>
            ) : (
            <a href="/login">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                <User size={18} className="mr-2" />
                Đăng nhập
                </button>
            </a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Hệ thống dự đoán bệnh thông minh</h1>
            <p className="text-xl text-gray-700 mb-8">
              Kết hợp Machine Learning và trí tuệ nhân tạo để hỗ trợ chẩn đoán y tế thông qua phân tích triệu chứng kết hợp dữ liệu môi trường
            </p>
            
            {/* Quote */}
            <div className="max-w-2xl mx-auto my-12 px-8 relative">
              <div className="text-blue-500 text-6xl font-serif absolute -top-6 left-0">"</div>
              <blockquote className="italic text-xl text-gray-700">
                AI sẽ không thay thế các bác sĩ, nhưng những bác sĩ biết sử dụng AI sẽ thay thế những người không biết.
              </blockquote>
              <div className="text-blue-500 text-6xl font-serif absolute -bottom-16 right-0">"</div>
              <p className="text-gray-500 mt-4">— Phỏng theo Eric Topol, MD</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Giới thiệu đồ án</h2>
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="md:w-2/5">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <img 
                src="/images/ThanhDepTrai.jpg" 
                alt="Nhóm 5" 
                className="w-full h-auto rounded-lg" 
              />
              <div className="p-3 text-center text-gray-700">
                Nhóm 5 - Đồ án Machine Learning
              </div>
            </div>
            
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Thành viên nhóm</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Nguyễn Trọng Tất Thành</p>
                    <p className="text-gray-600 text-sm">MSSV: 23521455</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Trần Vạn Tấn</p>
                    <p className="text-gray-600 text-sm">MSSV: 2352XXXX</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Nguyễn Thiên Bảo</p>
                    <p className="text-gray-600 text-sm">MSSV: 2352XXXX</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:w-3/5">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Mục tiêu dự án</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bọn em thực hiện đồ án này với mong muốn xây dựng một hệ thống thông minh có khả năng hỗ trợ chẩn đoán bệnh dựa trên triệu chứng đầu vào,
                kết hợp cùng dữ liệu môi trường như thời tiết, nhằm góp phần hỗ trợ bác sĩ trong công tác khám chữa bệnh.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Không chỉ dừng lại ở việc dự đoán các bệnh phổ biến, hệ thống còn nhằm mục đích phân tích mối tương quan giữa điều kiện môi trường và sự phát triển của các triệu chứng, từ đó cung cấp gợi ý phòng ngừa phù hợp.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Công nghệ Machine Learning</h3>
                </div>
                <p className="text-gray-700">
                  Sử dụng các thuật toán học máy tiên tiến để phân tích dữ liệu và đưa ra dự đoán chính xác về các khả năng mắc bệnh.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <Cloud className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Tích hợp API</h3>
                </div>
                <p className="text-gray-700">
                  Kết nối với <strong>xGrok</strong> và <strong>AccuWeather</strong> để lấy dữ liệu môi trường và tăng cường khả năng phân tích.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <Server className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Hệ thống đa người dùng</h3>
                </div>
                <p className="text-gray-700">
                  Thiết kế giao diện web thân thiện cho cả bệnh nhân, bác sĩ và quản trị viên với các chức năng phù hợp.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 rounded-full p-3 mr-4">
                    <BookOpen className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Dữ liệu y tế</h3>
                </div>
                <p className="text-gray-700">
                  Được huấn luyện trên bộ dữ liệu y tế thực tế với nhiều bệnh và triệu chứng đa dạng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Achievement */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
              <div className="bg-yellow-100 rounded-full p-4">
                <Award className="h-12 w-12 text-yellow-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thành tựu dự án</h2>
            <p className="text-gray-700 mb-6">
              Dự án đã đạt được kết quả khả quan trong quá trình phát triển với độ chính xác dự đoán đạt trên 85% trên tập dữ liệu kiểm thử. Hệ thống đã được đánh giá cao bởi các giảng viên và chuyên gia trong lĩnh vực y tế và công nghệ thông tin.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">85%</p>
                <p className="text-gray-600">Độ chính xác</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">20+</p>
                <p className="text-gray-600">Loại bệnh</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">500+</p>
                <p className="text-gray-600">Triệu chứng</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">3</p>
                <p className="text-gray-600">API tích hợp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professor Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Giảng viên hướng dẫn</h2>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src="/images/ThanhDepTrai.jpg" 
                alt="Giảng viên" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:w-2/3">
              <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">Khoa Công nghệ thông tin</div>
              <h3 className="mt-2 text-2xl font-semibold text-gray-800">TS. Nguyễn Văn A</h3>
              <p className="mt-1 text-gray-500">Giảng viên bộ môn Machine Learning</p>
              <p className="mt-4 text-gray-700">
                Chúng em xin gửi lời cảm ơn chân thành đến TS. Nguyễn Văn A đã tận tình hướng dẫn, hỗ trợ và đóng góp ý kiến quý báu để nhóm có thể hoàn thành đồ án này một cách tốt nhất.
              </p>
            </div>
          </div>
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