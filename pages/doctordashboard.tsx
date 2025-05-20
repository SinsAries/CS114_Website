import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  Search, 
  Filter, 
  Edit, 
  Stethoscope, 
  PlusCircle, 
  FileText, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const router = useRouter();

  // State cho dữ liệu bệnh nhân
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'fullName',
    direction: 'ascending'
  });
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    gender: 'all',
    ageRange: 'all',
    lastVisit: 'all'
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [predictingPatient, setPredictingPatient] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success', 'error', 'info'
    message: ''
  });

  const [diseaseInfo, setDiseaseInfo] = useState(null); // Thông tin AI trả về
  const [showDiseaseInfoModal, setShowDiseaseInfoModal] = useState(false);
  const [loadingDiseaseInfo, setLoadingDiseaseInfo] = useState(false);

  const DISEASE_TRANSLATION = {
    "Heart Attack": "Nhồi máu cơ tim",
    "Migraine": "Đau nửa đầu",
    "Influenza": "Cúm mùa",
    "Heat Stroke": "Sốc nhiệt / say nắng",
    "Malaria": "Sốt rét",
    "Stroke": "Đột quỵ",
    "Eczema": "Chàm / Viêm da cơ địa",
    "Dengue": "Sốt xuất huyết",
    "Common Cold": "Cảm lạnh thông thường",
    "Arthritis": "Viêm khớp",
    "Sinusitis": "Viêm xoang"
  };

  const SYMPTOM_TRANSLATION = {
    "tiredFeeling": "Cảm thấy mệt",
    "weakness": "Yếu",
    "chills": "Ớn lạnh",
    "bodyTrembling": "Run người",
    "bodyAches": "Đau nhức người",
    "highFever": "Sốt cao",
    "fever": "Sốt",
    "dizziness": "Chóng mặt",
    "confusion": "Rối loạn ý thức",

    "headache": "Đau đầu",
    "severeHeadache": "Đau đầu dữ dội",
    "pulsatingHeadache": "Đau đầu nhói",
    "sinusHeadache": "Đau đầu do viêm xoang",
    "painBehindEyeSockets": "Đau phía sau hốc mắt",
    "painBehindEyeballs": "Đau phía sau nhãn cầu",
    "visionProblems": "Vấn đề về thị lực",
    "facialPain": "Đau mặt",

    "cough": "Ho",
    "rapidBreathing": "Thở nhanh",
    "shortness": "Khó thở",
    "soreThroat": "Đau họng",
    "runnyNose": "Chảy nước mũi",
    "sneezing": "Hắt hơi",
    "smellTasteReduction": "Giảm khứu giác và vị giác",
    "nasalPolyps": "Polyp mũi",

    "nausea": "Buồn nôn",
    "vomiting": "Nôn",
    "diarrhea": "Tiêu chảy",
    "stomachPain": "Đau bụng",

    "rash": "Phát ban",
    "skinIrritation": "Kích ứng da",
    "itchiness": "Ngứa",

    "jointPain": "Đau khớp",
    "backPain": "Đau lưng",
    "kneePain": "Đau đầu gối",

    "chestPain": "Đau ngực",
    "palpitations": "Hồi hộp",

    "swollenLymphNodes": "Sưng hạch",

    "asthmaHistory": "Tiền sử hen suyễn",
    "currentAsthma": "Đang bị hen suyễn",
    "diabetes": "Đái tháo đường",
    "overweight": "Thừa cân/Béo phì",
    "hiv": "HIV/AIDS",
    "highCholesterol": "Cholesterol cao",
    "hypertension": "Tăng huyết áp"
  };

  // Thêm state để lưu thông tin giải thích
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [infoError, setInfoError] = useState("");

  // Hàm gọi API
  const fetchDiseaseInfo = async (disease, symptoms) => {
    setLoadingInfo(true);
    setDiseaseInfo("");
    setInfoError("");
    try {
      const res = await fetch("/api/diseaseinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease, symptoms })
      });
      const data = await res.json();
      if (data.explanation) setDiseaseInfo(data.explanation);
      else setInfoError(data.error || "Không lấy được thông tin.");
    } catch (err) {
      setInfoError("Lỗi kết nối API");
    }
    setLoadingInfo(false);
  };


  // Mock data cho bệnh nhân (trong thực tế sẽ được lấy từ API)
  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storagePatients = JSON.parse(localStorage.getItem('patients') || '[]');
    // Gộp dữ liệu mock + local (hoặc chỉ lấy local nếu muốn)
    const allPatients = [...storagePatients];
    setPatients(allPatients);
    setFilteredPatients(allPatients);
    setLoading(false);
  }, []);


  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      // Nếu không có từ khóa tìm kiếm, áp dụng lại bộ lọc hiện tại
      applyFilters(filterOptions, patients);
    } else {
      // Tìm kiếm từ danh sách đã được lọc
      const results = patients.filter(patient => 
        patient.fullName.toLowerCase().includes(term.toLowerCase()) ||
        patient.email.toLowerCase().includes(term.toLowerCase()) ||
        patient.phone.includes(term)
      );
      
      setFilteredPatients(results);
    }
  };

  // Hàm xử lý sắp xếp
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredPatients].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredPatients(sortedData);
  };

  const handleShowDiseaseInfo = async (disease, symptoms) => {
    setLoadingDiseaseInfo(true);
    setShowDiseaseInfoModal(true);

    try {
      const res = await fetch('/api/diseaseinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease, symptoms })
      });
      const data = await res.json();
      setDiseaseInfo(data.explanation || 'Không có dữ liệu từ AI');
    } catch (err) {
      setDiseaseInfo('Không lấy được thông tin từ AI');
    }
    setLoadingDiseaseInfo(false);
  };

  // Hàm xử lý lọc
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filterOptions,
      [filterType]: value
    };
    
    setFilterOptions(newFilters);
    applyFilters(newFilters, patients);
  };

  // Hàm áp dụng bộ lọc
  const applyFilters = (filters, patientList) => {
    let results = [...patientList];
    
    // Lọc theo giới tính
    if (filters.gender !== 'all') {
      results = results.filter(patient => patient.gender === filters.gender);
    }
    
    // Lọc theo độ tuổi
    if (filters.ageRange !== 'all') {
      switch(filters.ageRange) {
        case 'under30':
          results = results.filter(patient => patient.age < 30);
          break;
        case '30to50':
          results = results.filter(patient => patient.age >= 30 && patient.age <= 50);
          break;
        case 'above50':
          results = results.filter(patient => patient.age > 50);
          break;
        default:
          break;
      }
    }
    
    // Lọc theo lần khám gần nhất
    if (filters.lastVisit !== 'all') {
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      
      switch(filters.lastVisit) {
        case 'lastMonth':
          results = results.filter(patient => new Date(patient.lastVisit) >= oneMonthAgo);
          break;
        case 'last3Months':
          results = results.filter(patient => new Date(patient.lastVisit) >= threeMonthsAgo);
          break;
        case 'older':
          results = results.filter(patient => new Date(patient.lastVisit) < threeMonthsAgo);
          break;
        default:
          break;
      }
    }
    
    // Áp dụng tìm kiếm nếu có
    if (searchTerm.trim() !== '') {
      results = results.filter(patient => 
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
    }
    
    setFilteredPatients(results);
  };

  // Hàm mở rộng/thu gọn thông tin chi tiết bệnh nhân
  const togglePatientDetails = (patientId) => {
    if (expandedPatientId === patientId) {
      setExpandedPatientId(null);
    } else {
      setExpandedPatientId(patientId);
    }
  };

  // Hàm mở modal chỉnh sửa thông tin bệnh nhân
  const openEditModal = (patient) => {
    setEditingPatient({...patient});
    setShowEditModal(true);
  };

  // Hàm lưu thông tin bệnh nhân đã chỉnh sửa
  const savePatient = () => {
    // Cập nhật danh sách bệnh nhân
    const updatedPatients = patients.map(patient => 
      patient.id === editingPatient.id ? editingPatient : patient
    );
    
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
    setShowEditModal(false);
    
    // Hiển thị thông báo
    setNotification({
      show: true,
      type: 'success',
      message: 'Đã cập nhật thông tin bệnh nhân thành công!'
    });
    
    // Tự động ẩn thông báo sau 5 giây
    setTimeout(() => {
      setNotification({show: false, type: '', message: ''});
    }, 5000);
  };

  // Hàm cập nhật trường thông tin của bệnh nhân đang chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPatient({
      ...editingPatient,
      [name]: value
    });
  };

  // Hàm mở modal dự đoán bệnh
  const openPredictModal = (patient) => {
    setPredictingPatient({...patient});
    setShowPredictModal(true);
  };

  const MODEL_LIST = [
    'decision_tree_custom',
    'decision_tree_sklearn',
    'gaussian_nb_custom',
    'gaussian_nb_sklearn',
    'knn_custom',
    'knn_sklearn',
    'logistic_regression_custom',
    'logistic_regression_sklearn',
    'random_forest_custom',
    'random_forest_sklearn',
    'svm_custom',
    'svm_sklearn'
  ];

  // Hàm thực hiện dự đoán bệnh
  const predictDisease = async () => {
    if (!predictingPatient || !predictingPatient.featureVector) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Không tìm thấy dữ liệu vector đặc trưng!'
      });
      return;
    }

    let featureVector = [...predictingPatient.featureVector];
    featureVector[0] = parseInt(featureVector[0], 10);

    setNotification({ show: true, type: 'info', message: 'Đang dự đoán với tất cả mô hình...' });

    try {
      // Gọi API cho tất cả model
      const predictPromises = MODEL_LIST.map(async (modelName) => {
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            featureVector,
            modelName
          })
        });
        const data = await res.json();
        return {
          model: modelName,
          disease: data.result?.disease || 'N/A',
          probability: data.result?.probability || 1, // nếu backend trả về
          error: data.error
        };
      });

      const allResults = await Promise.all(predictPromises);

      setPredictingPatient({
        ...predictingPatient,
        predictions: allResults
      });

      setNotification({
        show: true,
        type: 'success',
        message: 'Đã dự đoán xong với tất cả mô hình!'
      });

    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: `Lỗi dự đoán: ${error.message}`
      });
    }

    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  };


  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
            <Link href="/" className="text-gray-600 hover:text-blue-600">Trang chủ</Link>
            <Link href="/symptominput" className="text-gray-600 hover:text-blue-600">Dự đoán</Link>
            <Link href="/info" className="text-gray-600 hover:text-blue-600">Thông tin</Link>
            <span className="text-blue-600 font-medium cursor-default">Quản lý</span>
            </nav>
            <div className="flex items-center">
            <button className="bg-white text-gray-700 mr-4 px-4 py-2 rounded-lg flex items-center hover:bg-gray-100 transition-colors">
                <Stethoscope size={18} className="mr-2" />
                Bs. Nguyễn Văn A
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                <User size={18} className="mr-2" />
                Đăng xuất
            </button>
            </div>
        </div>
    </header>


      {/* Thông báo */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 mr-2" />
          ) : notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5 mr-2" />
          ) : (
            <Info className="h-5 w-5 mr-2" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý bệnh nhân</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors">
            <PlusCircle size={18} className="mr-2" />
            Thêm bệnh nhân mới
          </button>
        </div>

        {/* Thanh tìm kiếm và lọc */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Bộ lọc
              {showFilterPanel ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </button>
          </div>

          {/* Panel bộ lọc */}
          {showFilterPanel && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select
                    value={filterOptions.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Độ tuổi</label>
                  <select
                    value={filterOptions.ageRange}
                    onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="under30">Dưới 30 tuổi</option>
                    <option value="30to50">30 - 50 tuổi</option>
                    <option value="above50">Trên 50 tuổi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lần khám gần nhất</label>
                  <select
                    value={filterOptions.lastVisit}
                    onChange={(e) => handleFilterChange('lastVisit', e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="lastMonth">Trong tháng qua</option>
                    <option value="last3Months">Trong 3 tháng qua</option>
                    <option value="older">Hơn 3 tháng</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Danh sách bệnh nhân */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">Không tìm thấy bệnh nhân nào</p>
              <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => requestSort('fullName')}
                      >
                        <span>Tên bệnh nhân</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => requestSort('age')}
                      >
                        <span>Tuổi</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới tính
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => requestSort('lastVisit')}
                      >
                        <span>Lần khám gần nhất</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map(patient => (
                    <React.Fragment key={patient.id}>
                      <tr 
                        className={`hover:bg-gray-50 ${expandedPatientId === patient.id ? 'bg-blue-50' : ''}`}
                        onClick={() => togglePatientDetails(patient.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                              <div className="text-sm text-gray-500">ID: {patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {patient.gender === 'male' ? 'Nam' : 'Nữ'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.phone}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(patient.lastVisit)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(patient);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900 bg-green-100 p-2 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPredictModal(patient);
                              }}
                            >
                              <Stethoscope className="h-4 w-4" />
                            </button>
                            {expandedPatientId === patient.id ? (
                              <button className="text-gray-600 hover:text-gray-900 bg-gray-100 p-2 rounded-lg">
                                <ChevronUp className="h-4 w-4" />
                              </button>
                            ) : (
                              <button className="text-gray-600 hover:text-gray-900 bg-gray-100 p-2 rounded-lg">
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Chi tiết bệnh nhân khi mở rộng */}
                      {expandedPatientId === patient.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-blue-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Thông tin cá nhân</h3>
                                <p className="text-gray-700"><span className="font-medium">Địa chỉ:</span> {patient.address}</p>
                                
                                <h3 className="text-lg font-semibold mt-4 mb-2">Bệnh lý mãn tính</h3>
                                {patient.chronicDiseases.length > 0 ? (
                                  <ul className="list-disc pl-5 text-gray-700">
                                    {patient.chronicDiseases.map((disease, index) => (
                                      <li key={index}>{disease}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 italic">Không có</p>
                                )}
                                
                                <h3 className="text-lg font-semibold mt-4 mb-2">Triệu chứng gần đây</h3>
                                {patient.symptoms.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {patient.symptoms.map((symptom, index) => (
                                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                        {SYMPTOM_TRANSLATION[symptom] || symptom}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 italic">Không có</p>
                                )}
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Lịch sử khám bệnh</h3>
                                {patient.medicalHistory.length > 0 ? (
                                  <div className="space-y-3">
                                    {patient.medicalHistory.map((record, index) => (
                                      <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                                        <div className="flex justify-between">
                                          <span className="font-medium">{formatDate(record.date)}</span>
                                          <span className="text-gray-500">{record.doctor}</span>
                                        </div>
                                        <p className="text-gray-700">{record.diagnosis}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 italic">Không có</p>
                                )}
                                
                                {patient.predictions && (
                                  <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Kết quả dự đoán gần nhất</h3>
                                    <div className="space-y-2">
                                      {patient.predictions.map((prediction, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                          <span className="text-gray-700">{DISEASE_TRANSLATION[prediction.disease] || prediction.disease}</span>
                                          <div className="flex items-center">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                                              <div 
                                                className="h-2 bg-blue-600 rounded-full" 
                                                style={{width: `${prediction.probability * 100}%`}}
                                              ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{Math.round(prediction.probability * 100)}%</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal chỉnh sửa thông tin bệnh nhân */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa thông tin bệnh nhân</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editingPatient.fullName}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Tuổi
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={editingPatient.age}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={editingPatient.gender}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editingPatient.phone}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editingPatient.email}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={editingPatient.address}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bệnh lý mãn tính
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingPatient.chronicDiseases.map((disease, index) => (
                      <div key={index} className="bg-blue-100 rounded-full px-3 py-1 flex items-center">
                        <span className="text-blue-800 text-sm">{disease}</span>
                        <button 
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            const updatedDiseases = [...editingPatient.chronicDiseases];
                            updatedDiseases.splice(index, 1);
                            setEditingPatient({
                              ...editingPatient,
                              chronicDiseases: updatedDiseases
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Thêm bệnh lý mãn tính"
                      className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim() !== '') {
                          setEditingPatient({
                            ...editingPatient,
                            chronicDiseases: [...editingPatient.chronicDiseases, e.target.value.trim()]
                          });
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        if (input.value.trim() !== '') {
                          setEditingPatient({
                            ...editingPatient,
                            chronicDiseases: [...editingPatient.chronicDiseases, input.value.trim()]
                          });
                          input.value = '';
                        }
                      }}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={savePatient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal dự đoán bệnh */}
      {showPredictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold text-gray-800">Dự đoán bệnh</h2>
              <button 
                onClick={() => setShowPredictModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Thông tin bệnh nhân</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Tên bệnh nhân:</p>
                      <p className="font-medium">{predictingPatient.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tuổi:</p>
                      <p className="font-medium">{predictingPatient.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Giới tính:</p>
                      <p className="font-medium">{predictingPatient.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Số điện thoại:</p>
                      <p className="font-medium">{predictingPatient.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Triệu chứng hiện tại</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {predictingPatient.symptoms.map((symptom, index) => (
                    <div key={index} className="bg-blue-100 rounded-full px-3 py-1 flex items-center">
                      <span className="text-blue-800 text-sm">{SYMPTOM_TRANSLATION[symptom] || symptom}</span>
                      <button 
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          const updatedSymptoms = [...predictingPatient.symptoms];
                          updatedSymptoms.splice(index, 1);
                          setPredictingPatient({
                            ...predictingPatient,
                            symptoms: updatedSymptoms
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Thêm triệu chứng"
                    className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim() !== '') {
                        setPredictingPatient({
                          ...predictingPatient,
                          symptoms: [...predictingPatient.symptoms, e.target.value.trim()]
                        });
                        e.target.value = '';
                      }
                    }}
                  />
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      if (input.value.trim() !== '') {
                        setPredictingPatient({
                          ...predictingPatient,
                          symptoms: [...predictingPatient.symptoms, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }}
                  >
                    Thêm
                  </button>
                </div>
              </div>
              
              {predictingPatient.predictions && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Kết quả dự đoán của 12 mô hình</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left py-1 px-2">Mô hình</th>
                          <th className="text-left py-1 px-2">Kết quả</th>
                          {/* <th className="text-left py-1 px-2">Xác suất</th> nếu có */}
                          <th className="text-left py-1 px-2">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictingPatient.predictions.map((prediction, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-1 px-2 font-mono">{prediction.model}</td>
                            <td className="py-1 px-2">
                              {prediction.error ? (
                                <span className="text-red-600">{prediction.error}</span>
                              ) : (
                                <button
                                  className="text-blue-700 underline hover:text-blue-900"
                                  onClick={() => {
                                    // Chuyển sang mở tab mới với URL phù hợp
                                    const url = `/diseaseinfo/${encodeURIComponent(prediction.disease)}?symptoms=${encodeURIComponent(JSON.stringify(predictingPatient.symptoms))}`;
                                    window.open(url, "_blank"); // Mở tab mới
                                  }}
                                  type="button"
                                >
                                  {DISEASE_TRANSLATION[prediction.disease] || prediction.disease}
                                </button>
                              )}
                            </td> 
                            {/* <td className="py-1 px-2">{Math.round(prediction.probability * 100)}%</td> nếu có */}
                            <td className="py-1 px-2">
                              {prediction.error ? (
                                <span className="text-red-500">Lỗi</span>
                              ) : (
                                <span className="text-green-600">OK</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPredictModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  onClick={predictDisease}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Dự đoán bệnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
    <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="flex items-center mb-4 md:mb-0">
            <Activity className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">MedPredict</span>
        </Link>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Link href="/terms" className="text-gray-600 hover:text-blue-600">Điều khoản sử dụng</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600">Chính sách bảo mật</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600">Giới thiệu</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Liên hệ</Link>
        </div>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
        <p>© 2025 MedPredict. Tất cả các quyền được bảo lưu.</p>
        <p className="mt-2">Lưu ý: Kết quả dự đoán chỉ mang tính chất tham khảo và không thay thế cho tư vấn y tế chuyên nghiệp.</p>
        </div>
    </div>
    </footer>

    {/* Modal giải thích bệnh và triệu chứng */}
    {(diseaseInfo || loadingInfo || infoError) && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            onClick={() => {
              setDiseaseInfo("");
              setInfoError("");
              setLoadingInfo(false);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <h3 className="text-xl font-semibold mb-2">Thông tin bệnh & giải thích triệu chứng</h3>
          {loadingInfo && <div>Đang tải thông tin...</div>}
          {infoError && <div className="text-red-600">{infoError}</div>}
          {diseaseInfo && (
            <div className="whitespace-pre-line text-gray-800 mt-2" style={{maxHeight: 350, overflowY: "auto"}}>
              {diseaseInfo}
            </div>
          )}
        </div>
      </div>
    )}
    </main>   
  );
}