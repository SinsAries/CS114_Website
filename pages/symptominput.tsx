import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Activity, User, ChevronDown, ChevronUp, Save, RotateCcw, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

export default function SymptomInputPage() {
  const districtLocationKeys = {
    "District 1": "3554433",
    "District 2": "3554434",
    "District 3": "3554435",
    "District 4": "3554436",
    "District 5": "3554437",
    "District 6": "3554438",
    "District 7": "3554439",
    "District 8": "3554440",
    "District 9": "3554441",
    "District 10": "3554442",
    "District 11": "3554443",
    "District 12": "3554444",
    "Binh Thanh District": "1696411",
    "Go Vap District": "425682",
    "Phu Nhuan District": "418146",
    "Tan Binh District": "416036",
    "Tan Phu District": "3554445",
    "Binh Tan District": "3554446",
    "Thu Duc City": "414495",
    "Nha Be District": "353978",
    "Hoc Mon District": "425119",
    "Binh Chanh District": "429728",
    "Cu Chi District": "353977",
    "Can Gio District": "3554447",
  };

  const HCM_DISTRICTS = [
    { label: "Quận 1", value: "District 1" },
    { label: "Quận 2", value: "District 2" },
    { label: "Quận 3", value: "District 3" },
    { label: "Quận 4", value: "District 4" },
    { label: "Quận 5", value: "District 5" },
    { label: "Quận 6", value: "District 6" },
    { label: "Quận 7", value: "District 7" },
    { label: "Quận 8", value: "District 8" },
    { label: "Quận 9", value: "District 9" },
    { label: "Quận 10", value: "District 10" },
    { label: "Quận 11", value: "District 11" },
    { label: "Quận 12", value: "District 12" },
    { label: "Quận Bình Thạnh", value: "Binh Thanh District" },
    { label: "Quận Gò Vấp", value: "Go Vap District" },
    { label: "Quận Phú Nhuận", value: "Phu Nhuan District" },
    { label: "Quận Tân Bình", value: "Tan Binh District" },
    { label: "Quận Tân Phú", value: "Tan Phu District" },
    { label: "Quận Bình Tân", value: "Binh Tan District" },
    { label: "Thành phố Thủ Đức", value: "Thu Duc City" },
    { label: "Huyện Nhà Bè", value: "Nha Be District" },
    { label: "Huyện Hóc Môn", value: "Hoc Mon District" },
    { label: "Huyện Bình Chánh", value: "Binh Chanh District" },
    { label: "Huyện Củ Chi", value: "Cu Chi District" },
    { label: "Huyện Cần Giờ", value: "Can Gio District" },
  ];

  // State cho thông tin cá nhân
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    age: '',
    gender: '',
    province: '',
    district: '',
    ward: '',
    address: ''
  });

  // State cho trạng thái hiển thị của các nhóm triệu chứng
  const [expandedGroups, setExpandedGroups] = useState({
    group1: false,
    group2: false,
    group3: false,
    group4: false,
    group5: false,
    group6: false,
    group7: false,
    group8: false,
    group9: false
  });

  // State lưu trữ các triệu chứng
  const [symptoms, setSymptoms] = useState({
    // Nhóm 1: Triệu chứng toàn thân
    tiredFeeling: false,
    weakness: false,
    chills: false,
    bodyTrembling: false,
    bodyAches: false,
    highFever: false,
    fever: false,
    dizziness: false,
    confusion: false,
    
    // Nhóm 2: Triệu chứng ở đầu, mắt và mặt
    headache: false,
    severeHeadache: false,
    pulsatingHeadache: false,
    sinusHeadache: false,
    painBehindEyeSockets: false,
    painBehindEyeballs: false,
    visionProblems: false,
    facialPain: false,
    
    // Nhóm 3: Triệu chứng đường hô hấp
    cough: false,
    rapidBreathing: false,
    shortness: false,
    soreThroat: false,
    runnyNose: false,
    sneezing: false,
    smellTasteReduction: false,
    nasalPolyps: false,
    
    // Nhóm 4: Triệu chứng tiêu hóa
    nausea: false,
    vomiting: false,
    diarrhea: false,
    stomachPain: false,
    
    // Nhóm 5: Triệu chứng da liễu
    rash: false,
    skinIrritation: false,
    itchiness: false,
    
    // Nhóm 6: Triệu chứng cơ xương khớp
    jointPain: false,
    backPain: false,
    kneePain: false,
    
    // Nhóm 7: Triệu chứng tim mạch
    chestPain: false,
    palpitations: false,
    
    // Nhóm 8: Triệu chứng hệ bạch huyết
    swollenLymphNodes: false,
    
    // Nhóm 9: Tiền sử bệnh và bệnh lý mạn tính
    asthmaHistory: false,
    currentAsthma: false,
    diabetes: false,
    overweight: false,
    hiv: false,
    highCholesterol: false,
    hypertension: false
  });

  // State thông báo
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success' hoặc 'error'
    message: ''
  });

  // Hàm toggle nhóm triệu chứng
  const toggleGroup = (group) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: !expandedGroups[group]
    });
  };

  // Hàm cập nhật thông tin cá nhân
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => {
      const newVal = { ...prev, [name]: value };
      console.log('Change:', name, value, newVal);
      return newVal;
    });
  };

  // Hàm cập nhật triệu chứng
  const handleSymptomChange = (symptom) => {
    setSymptoms({
      ...symptoms,
      [symptom]: !symptoms[symptom]
    });
  };

  // Hàm xử lý gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!personalInfo.fullName || !personalInfo.age || !personalInfo.gender) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Vui lòng điền đầy đủ họ tên, tuổi và giới tính!'
      });
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
      return;
    }

    if (
      weatherInfo.temperature == null &&
      weatherInfo.humidity == null &&
      weatherInfo.windSpeed == null
    ) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Đang lấy thông tin thời tiết, vui lòng đợi vài giây và thử lại!'
      });
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
      return;
    }

    // Tạo vector
    const featureVector = buildFeatureVector();

    // Xây dựng object bệnh nhân cho trang bác sĩ
    const patientObj = {
      id: Date.now(), // đơn giản hóa id cho demo
      fullName: personalInfo.fullName,
      age: personalInfo.age,
      gender: personalInfo.gender,
      phone: personalInfo.phone || "",
      email: personalInfo.email || "",
      address: `${personalInfo.address || ""} ${personalInfo.ward || ""} ${personalInfo.district || ""} ${personalInfo.province || ""}`,
      lastVisit: new Date().toISOString().slice(0, 10),
      symptoms: Object.keys(symptoms).filter(key => symptoms[key]), // lấy các triệu chứng đang có
      chronicDiseases: [
        symptoms.diabetes && "Tiểu đường",
        symptoms.hypertension && "Tăng huyết áp",
        symptoms.highCholesterol && "Mỡ máu cao",
        symptoms.hiv && "HIV/AIDS",
        symptoms.overweight && "Béo phì/thừa cân",
        symptoms.asthmaHistory && "Tiền sử hen suyễn",
        symptoms.currentAsthma && "Đang bị hen suyễn"
      ].filter(Boolean),
      featureVector // lưu lại cho ML sau này
    };

    // Lưu vào localStorage, dưới dạng mảng
    const oldList = JSON.parse(localStorage.getItem('patients') || '[]');
    oldList.push(patientObj);
    localStorage.setItem('patients', JSON.stringify(oldList));

    setNotification({
      show: true,
      type: 'success',
      message: 'Thông tin đã được gửi thành công. Đang phân tích kết quả...'
    });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);

    // Có thể chuyển hướng sang /doctordashboard nếu muốn:
    // router.push('/doctordashboard');
  };



  // Hàm reset form
  const resetForm = () => {
    // Reset thông tin cá nhân
    setPersonalInfo({
      fullName: '',
      age: '',
      gender: '',
      province: '',
      district: '',
      ward: '',
      address: ''
    });
    
    // Reset tất cả triệu chứng về false
    const resetSymptoms = {} as typeof symptoms;
    Object.keys(symptoms).forEach(key => {
      resetSymptoms[key] = false;
    });
    setSymptoms(resetSymptoms);
    
    // Hiển thị thông báo
    setNotification({
      show: true,
      type: 'success',
      message: 'Đã xóa tất cả thông tin'
    });
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Hàm xử lý hover
  function buildFeatureVector() {
    return [
      personalInfo.age,                         // Age
      personalInfo.gender,                      // Gender
      weatherInfo.temperature,                  // Temperature (C)
      weatherInfo.humidity,                     // Humidity
      weatherInfo.windSpeed,                    // Wind Speed (km/h)
      symptoms.nausea,                          // nausea
      symptoms.jointPain,                       // joint_pain
      symptoms.stomachPain,                     // abdominal_pain
      symptoms.highFever,                       // high_fever
      symptoms.chills,                          // chills
      symptoms.tiredFeeling,                    // fatigue
      symptoms.runnyNose,                       // runny_nose
      symptoms.painBehindEyeSockets,            // pain_behind_the_eyes
      symptoms.dizziness,                       // dizziness
      symptoms.headache,                        // headache
      symptoms.chestPain,                       // chest_pain
      symptoms.vomiting,                        // vomiting
      symptoms.cough,                           // cough
      symptoms.bodyTrembling,                   // shivering
      symptoms.asthmaHistory,                   // asthma_history
      symptoms.highCholesterol,                 // high_cholesterol
      symptoms.diabetes,                        // diabetes
      symptoms.overweight,                      // obesity
      symptoms.hiv,                             // hiv_aids
      symptoms.nasalPolyps,                     // nasal_polyps
      symptoms.currentAsthma,                   // asthma
      symptoms.hypertension,                    // high_blood_pressure
      symptoms.severeHeadache,                  // severe_headache
      symptoms.weakness,                        // weakness
      symptoms.visionProblems,                  // trouble_seeing
      symptoms.fever,                           // fever
      symptoms.bodyAches,                       // body_aches
      symptoms.soreThroat,                      // sore_throat
      symptoms.sneezing,                        // sneezing
      symptoms.diarrhea,                        // diarrhea
      symptoms.rapidBreathing,                  // rapid_breathing
      symptoms.palpitations,                    // rapid_heart_rate
      symptoms.painBehindEyeballs,              // pain_behind_eyes
      symptoms.swollenLymphNodes,               // swollen_glands
      symptoms.rash,                            // rashes
      symptoms.sinusHeadache,                   // sinus_headache
      symptoms.facialPain,                      // facial_pain
      symptoms.shortness,                       // shortness_of_breath
      symptoms.smellTasteReduction,             // reduced_smell_and_taste
      symptoms.skinIrritation,                  // skin_irritation
      symptoms.itchiness,                       // itchiness
      symptoms.pulsatingHeadache,               // throbbing_headache
      symptoms.confusion,                       // confusion
      symptoms.backPain,                        // back_pain
      symptoms.kneePain                         // knee_ache
    ];
  }

  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [weatherInfo, setWeatherInfo] = useState({
    temperature: null,
    humidity: null,
    windSpeed: null,
  });

  useEffect(() => {
  if (typeof window !== "undefined") {
    const u = localStorage.getItem('loggedInUser');
    if (u) {
      const userObj = JSON.parse(u);
      setUser(userObj);
      setPersonalInfo((prev) => ({
        ...prev,
        fullName: userObj.fullName || '',
        // Điền thêm nếu cần
      }));
    } else {
      router.replace('/login');
    }
  }
  }, []);

  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    console.log("District changed:", personalInfo.district);
    async function fetchWeather() {
      if (!personalInfo.district) {
        setWeatherInfo({ temperature: null, humidity: null, windSpeed: null });
        setWeatherLoading(false);
        return;
      }
      const locationKey = districtLocationKeys[personalInfo.district];
      if (!locationKey) {
        setWeatherInfo({ temperature: null, humidity: null, windSpeed: null });
        setWeatherLoading(false);
        return;
      }

      setWeatherLoading(true);
      try {
        const resp = await fetch(
          `/api/weather?locationKey=${locationKey}`
        );
        const data = await resp.json();
        if (data && data[0]) {
          setWeatherInfo({
            temperature: data[0].Temperature.Metric.Value,      // Độ C
            humidity: data[0].RelativeHumidity,                 // %
            windSpeed: data[0].Wind.Speed.Metric.Value,         // km/h
          });
        } else {
          setWeatherInfo({ temperature: null, humidity: null, windSpeed: null });
        }
      } catch (error) {
        setWeatherInfo({ temperature: null, humidity: null, windSpeed: null });
        console.error("Weather API error:", error);
      }
      setWeatherLoading(false);
    }
    fetchWeather();
  }, [personalInfo.district]);
  
  const handleStart = () => {
    if (user) {
      router.push('/symptominput');
    } else {
      router.push('/login');
    }
  };

  console.log('weatherInfo:', weatherInfo);

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
            <Link href="/info" className="text-gray-600 hover:text-blue-600">Thông tin</Link>
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

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Nhập thông tin triệu chứng</h1>
          <p className="text-gray-600 mb-8">
            Vui lòng cung cấp thông tin cá nhân và chọn các triệu chứng bạn đang gặp phải để hệ thống có thể đưa ra dự đoán chính xác nhất.
          </p>
          
          {personalInfo.district && weatherInfo.temperature !== null && (
            <div className="mb-6 flex flex-wrap gap-4 bg-blue-50 rounded-xl px-4 py-2">
              <span>Nhiệt độ: <b>{weatherInfo.temperature}°C</b></span>
              <span>Độ ẩm: <b>{weatherInfo.humidity}%</b></span>
              <span>Gió: <b>{weatherInfo.windSpeed} km/h</b></span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-gray-700 font-medium mb-2">Tuổi <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={personalInfo.age}
                    onChange={handlePersonalInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="35"
                    min="0"
                    max="120"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">Giới tính <span className="text-red-500">*</span></label>
                  <select
                    id="gender"
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-1 text-blue-600" />
                  Địa chỉ (tùy chọn)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="province" className="block text-gray-700 mb-1">Tỉnh/Thành phố</label>
                    <select
                      id="province"
                      name="province"
                      value={personalInfo.province}
                      onChange={handlePersonalInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn Tỉnh/TP --</option>
                      <option value="HCM">TP Hồ Chí Minh</option>
                      {/* Thêm các tỉnh thành khác */}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="district" className="block text-gray-700 mb-1">Quận/Huyện</label>
                    <select
                      id="district"
                      name="district"
                      value={personalInfo.district}
                      onChange={handlePersonalInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!personalInfo.province}
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {personalInfo.province === "HCM" &&
                        HCM_DISTRICTS.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            

            {/* Triệu chứng */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Triệu chứng</h2>
              <p className="text-gray-600 mb-6">Vui lòng chọn các triệu chứng mà bạn đang gặp phải.</p>
              
              {/* Nhóm 1: Triệu chứng toàn thân */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group1')}
                >
                  <h3 className="font-medium text-gray-800">1. Triệu chứng toàn thân</h3>
                  {expandedGroups.group1 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.tiredFeeling}
                          onChange={() => handleSymptomChange('tiredFeeling')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy mệt mỏi, uể oải, thiếu năng lượng không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.weakness}
                          onChange={() => handleSymptomChange('weakness')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy yếu sức, cơ thể suy nhược bất thường không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.chills}
                          onChange={() => handleSymptomChange('chills')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy ớn lạnh hoặc rét run không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.bodyTrembling}
                          onChange={() => handleSymptomChange('bodyTrembling')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị run rẩy toàn thân không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.bodyAches}
                          onChange={() => handleSymptomChange('bodyAches')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau nhức mình mẩy, đau mỏi cơ bắp toàn thân không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.highFever}
                          onChange={() => handleSymptomChange('highFever')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị sốt cao (nhiệt độ từ 38.5 độ C trở lên) không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.fever}
                          onChange={() => handleSymptomChange('fever')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị sốt (cảm thấy nóng người, nhiệt độ cơ thể tăng trên mức bình thường) không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.dizziness}
                          onChange={() => handleSymptomChange('dizziness')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy chóng mặt, choáng váng không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.confusion}
                          onChange={() => handleSymptomChange('confusion')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy đầu óc lú lẫn, khó tập trung, hoặc suy nghĩ không được minh mẫn không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 2: Triệu chứng ở đầu, mắt và mặt */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group2')}
                >
                  <h3 className="font-medium text-gray-800">2. Triệu chứng ở đầu, mắt và mặt</h3>
                  {expandedGroups.group2 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group2 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.headache}
                          onChange={() => handleSymptomChange('headache')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị nhức đầu hoặc đau đầu nói chung không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.severeHeadache}
                          onChange={() => handleSymptomChange('severeHeadache')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Cơn đau đầu của bạn có dữ dội, nghiêm trọng không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.pulsatingHeadache}
                          onChange={() => handleSymptomChange('pulsatingHeadache')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Cơn đau đầu của bạn có phải kiểu đau nhói, giật giật theo nhịp mạch đập không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.sinusHeadache}
                          onChange={() => handleSymptomChange('sinusHeadache')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau đầu kiểu viêm xoang (đau ở vùng trán, má, quanh mắt) không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.painBehindEyeSockets}
                          onChange={() => handleSymptomChange('painBehindEyeSockets')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau ở vùng phía sau hốc mắt không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.painBehindEyeballs}
                          onChange={() => handleSymptomChange('painBehindEyeballs')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau nhức ở khu vực phía sau nhãn cầu không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.visionProblems}
                          onChange={() => handleSymptomChange('visionProblems')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có gặp khó khăn về thị lực, ví dụ như nhìn mờ, nhìn đôi, hoặc khó nhìn không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.facialPain}
                          onChange={() => handleSymptomChange('facialPain')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau ở bất kỳ vùng nào trên mặt không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 3: Triệu chứng đường hô hấp */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group3')}
                >
                  <h3 className="font-medium text-gray-800">3. Triệu chứng đường hô hấp</h3>
                  {expandedGroups.group3 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group3 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.cough}
                          onChange={() => handleSymptomChange('cough')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị ho không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.rapidBreathing}
                          onChange={() => handleSymptomChange('rapidBreathing')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy mình thở nhanh, thở gấp hơn bình thường không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.shortness}
                          onChange={() => handleSymptomChange('shortness')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị khó thở, hụt hơi, hoặc cảm giác thở không đủ sâu không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.soreThroat}
                          onChange={() => handleSymptomChange('soreThroat')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau họng hoặc rát họng không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.runnyNose}
                          onChange={() => handleSymptomChange('runnyNose')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị chảy nước mũi hoặc sổ mũi không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.sneezing}
                          onChange={() => handleSymptomChange('sneezing')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị hắt xì hơi nhiều hoặc liên tục không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.smellTasteReduction}
                          onChange={() => handleSymptomChange('smellTasteReduction')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Khả năng ngửi mùi hoặc nếm vị của bạn có bị giảm sút dạo gần đây không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.nasalPolyps}
                          onChange={() => handleSymptomChange('nasalPolyps')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có được chẩn đoán là bị polyp mũi không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 4: Triệu chứng tiêu hóa */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group4')}
                >
                  <h3 className="font-medium text-gray-800">4. Triệu chứng tiêu hóa</h3>
                  {expandedGroups.group4 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group4 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.nausea}
                          onChange={() => handleSymptomChange('nausea')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy buồn nôn không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.vomiting}
                          onChange={() => handleSymptomChange('vomiting')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị nôn hoặc ói mửa không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.diarrhea}
                          onChange={() => handleSymptomChange('diarrhea')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị tiêu chảy (đi ngoài phân lỏng nhiều lần trong ngày) không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.stomachPain}
                          onChange={() => handleSymptomChange('stomachPain')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau bụng không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 5: Triệu chứng da liễu */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group5')}
                >
                  <h3 className="font-medium text-gray-800">5. Triệu chứng da liễu</h3>
                  {expandedGroups.group5 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group5 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.rash}
                          onChange={() => handleSymptomChange('rash')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Da của bạn có bị nổi mẩn đỏ, phát ban, hoặc các dạng ban khác không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.skinIrritation}
                          onChange={() => handleSymptomChange('skinIrritation')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Da của bạn có bị kích ứng, mẩn ngứa, đỏ rát, hoặc khó chịu không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.itchiness}
                          onChange={() => handleSymptomChange('itchiness')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy ngứa ở một vùng cụ thể hay nhiều nơi trên cơ thể không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 6: Triệu chứng cơ xương khớp */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group6')}
                >
                  <h3 className="font-medium text-gray-800">6. Triệu chứng cơ xương khớp</h3>
                  {expandedGroups.group6 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group6 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.jointPain}
                          onChange={() => handleSymptomChange('jointPain')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau các khớp xương không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.backPain}
                          onChange={() => handleSymptomChange('backPain')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau lưng không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.kneePain}
                          onChange={() => handleSymptomChange('kneePain')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau nhức ở khớp gối không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 7: Triệu chứng tim mạch */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group7')}
                >
                  <h3 className="font-medium text-gray-800">7. Triệu chứng tim mạch</h3>
                  {expandedGroups.group7 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group7 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.chestPain}
                          onChange={() => handleSymptomChange('chestPain')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị đau tức ngực không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.palpitations}
                          onChange={() => handleSymptomChange('palpitations')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có cảm thấy tim đập nhanh, hồi hộp, hoặc đánh trống ngực không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 8: Triệu chứng hệ bạch huyết */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group8')}
                >
                  <h3 className="font-medium text-gray-800">8. Triệu chứng hệ bạch huyết</h3>
                  {expandedGroups.group8 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group8 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.swollenLymphNodes}
                          onChange={() => handleSymptomChange('swollenLymphNodes')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có thấy nổi hạch hoặc sưng các tuyến bạch huyết (ví dụ ở cổ, nách, bẹn) không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nhóm 9: Tiền sử bệnh và bệnh lý mạn tính */}
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup('group9')}
                >
                  <h3 className="font-medium text-gray-800">9. Tiền sử bệnh và bệnh lý mạn tính</h3>
                  {expandedGroups.group9 ? <ChevronUp /> : <ChevronDown />}
                </div>
                
                {expandedGroups.group9 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.asthmaHistory}
                          onChange={() => handleSymptomChange('asthmaHistory')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có tiền sử bệnh hen suyễn không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.currentAsthma}
                          onChange={() => handleSymptomChange('currentAsthma')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có đang bị bệnh hen suyễn không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.diabetes}
                          onChange={() => handleSymptomChange('diabetes')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị bệnh tiểu đường không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.overweight}
                          onChange={() => handleSymptomChange('overweight')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có đang trong tình trạng thừa cân hoặc béo phì không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.hiv}
                          onChange={() => handleSymptomChange('hiv')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có tiền sử hoặc đang điều trị nhiễm HIV/AIDS không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.highCholesterol}
                          onChange={() => handleSymptomChange('highCholesterol')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có được chẩn đoán là mỡ máu cao không?</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded">
                        <input 
                          type="checkbox" 
                          checked={symptoms.hypertension}
                          onChange={() => handleSymptomChange('hypertension')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span>Bạn có bị cao huyết áp không?</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nút điều khiển */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                disabled={weatherLoading}
              >
                <Save className="h-5 w-5 mr-2" />
                {weatherLoading ? "Đang lấy thời tiết..." : "Gửi thông tin và phân tích"}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Xóa và làm lại
              </button>
            </div>
          </form>
        </div>
      </div>

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