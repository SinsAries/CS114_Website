// pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { locationKey } = req.query;

  if (!locationKey) {
    return res.status(400).json({ error: 'Missing locationKey' });
  }

  try {
    const resp = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=xwHTZox2BOuAgA5yhvD3IOlSZohbKAku&details=true`
    );

    // AccuWeather thường trả về 200 ngay cả khi key sai, nhưng data rỗng
    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'AccuWeather API error', status: resp.status });
    }

    const data = await resp.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
