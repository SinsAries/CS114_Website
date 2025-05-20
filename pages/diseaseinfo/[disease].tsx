import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';

export default function DiseaseInfoPage() {
  const router = useRouter();
  const { disease } = router.query;
  // lấy symptoms (chú ý cách truyền, có thể là chuỗi hoặc mảng)
  const symptomsRaw = router.query.symptoms;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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


  useEffect(() => {
    if (!disease || !symptomsRaw) return;

    // Convert symptoms về array
    let symptoms = [];
    if (typeof symptomsRaw === 'string') {
      try {
        symptoms = JSON.parse(symptomsRaw);
      } catch {
        symptoms = [symptomsRaw];
      }
    } else if (Array.isArray(symptomsRaw)) {
      symptoms = symptomsRaw;
    }

    setLoading(true);
    fetch('/api/diseaseinfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disease, symptoms }),
    })
      .then(res => res.json())
      .then(setData)
      .catch(() => setError('Lỗi tải dữ liệu!'))
      .finally(() => setLoading(false));
  }, [disease, symptomsRaw]);

  let symptomsList = [];
    if (typeof symptomsRaw === 'string' && symptomsRaw.startsWith('[')) {
    try {
        symptomsList = JSON.parse(symptomsRaw);
    } catch { symptomsList = [symptomsRaw]; }
    } else if (Array.isArray(symptomsRaw)) {
    symptomsList = symptomsRaw;
    } else {
    symptomsList = [symptomsRaw];
    }

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 pt-10">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-xl font-bold text-blue-700 mb-3">
          Thông tin về bệnh & giải thích triệu chứng
        </h1>
        <div className="mb-2">
            <b>Bệnh:</b> {DISEASE_TRANSLATION[disease] || disease}
        </div>
        <div className="mb-2">
            <b>Triệu chứng:</b>{" "}
            {symptomsList.map(s => SYMPTOM_TRANSLATION[s] || s).join(", ")}
        </div>
        {loading && <div>Đang tải thông tin...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {data && (
          <div className="whitespace-pre-line mt-2 text-gray-900">
            {/* Nếu XAI trả về markdown, có thể dùng thư viện react-markdown để render */}
            <ReactMarkdown>{data.explanation}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
