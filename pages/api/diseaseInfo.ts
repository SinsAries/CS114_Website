// /pages/api/diseaseinfo.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

type Data = {
  explanation?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { disease, symptoms } = req.body;
  const XAI_API_KEY = "xai-Ro37hBYJjhWQbWje4DCO6AFj9rIgj58Y0DNX306EaRg3dz4rESrB6pgBGQ1QRQpXt0l0JNFmx5fPIw1W";

  if (!disease || !Array.isArray(symptoms)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const prompt = `
  Bạn là một bác sĩ giỏi, hãy trả lời hoàn toàn bằng tiếng Việt, trình bày dễ hiểu cho người bình thường.

  1. Giải thích ngắn gọn nhưng đầy đủ về bệnh "${disease}" (nguyên nhân, triệu chứng điển hình, nguy cơ và cách điều trị/cách phòng tránh, nếu có).
  2. Phân tích từng triệu chứng bệnh nhân đang có: [${symptoms.join(", ")}], đánh giá mối liên hệ giữa từng triệu chứng này với bệnh "${disease}". Nếu triệu chứng nào không điển hình hoặc hiếm gặp với bệnh này thì hãy chỉ rõ và giải thích.
  3. Kết luận: Đưa ra lời khuyên ngắn gọn cho bệnh nhân, nhấn mạnh cần gặp bác sĩ chuyên khoa để được chẩn đoán chính xác và điều trị phù hợp.

  Trả lời bằng tiếng Việt, trình bày rõ ràng từng phần.
  `;

  const client = new OpenAI({
    apiKey: XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
  });

  try {
    const completion = await client.chat.completions.create({
      model: "grok-3-mini",
      messages: [
        {"role": "system", "content": "Bạn là một bác sĩ nhiệt tình, trả lời thân thiện, súc tích, dễ hiểu bằng tiếng Việt."},
        { role: "user", content: prompt }
      ]
    });
    res.status(200).json({ explanation: completion.choices?.[0]?.message?.content || "" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Unknown error" });
  }
}
