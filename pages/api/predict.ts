import type { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'
import path from 'path'

type Data = {
  result?: any,
  error?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { featureVector, modelName } = req.body

  if (!featureVector || !modelName) {
    res.status(400).json({ error: 'Missing featureVector or modelName' })
    return
  }

  // Đường dẫn đến script predict.py
  const scriptPath = path.join(process.cwd(), 'python_tools', 'predict.py')

  // Tạo child process gọi Python
  const python = spawn('python', [
    scriptPath,
    JSON.stringify(featureVector),
    modelName
  ])

  let result = ''
  let error = ''

  python.stdout.on('data', (data) => {
    result += data.toString()
  })

  python.stderr.on('data', (data) => {
    error += data.toString()
  })

  python.on('close', (code) => {
    if (code === 0) {
      try {
        const output = JSON.parse(result)
        res.status(200).json({ result: output })
      } catch (e) {
        res.status(500).json({ error: 'Cannot parse result: ' + result })
      }
    } else {
      res.status(500).json({ error: error || 'Python process error' })
    }
  })
}
