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
  const apiKey = "xai-Ro37hBYJjhWQbWje4DCO6AFj9rIgj58Y0DNX306EaRg3dz4rESrB6pgBGQ1QRQpXt0l0JNFmx5fPIw1W";

  if (!disease || !Array.isArray(symptoms)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const prompt = `
Explain detailed information about the disease "${disease}". Then, analyze the relationship between the patient's symptoms [${symptoms.join(", ")}] and this diagnosis. For each symptom, explain why it may be related to "${disease}". If any symptom is not typical for this disease, point it out.
  `;

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1",
  });

  try {
    const completion = await client.chat.completions.create({
      model: "grok-3-beta",
      messages: [
        { role: "user", content: prompt }
      ]
    });
    res.status(200).json({ explanation: completion.choices?.[0]?.message?.content || "" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Unknown error" });
  }
}
