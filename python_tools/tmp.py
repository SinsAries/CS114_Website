from openai import OpenAI
    
client = OpenAI(
  api_key="xai-Ro37hBYJjhWQbWje4DCO6AFj9rIgj58Y0DNX306EaRg3dz4rESrB6pgBGQ1QRQpXt0l0JNFmx5fPIw1W",
  base_url="https://api.x.ai/v1",
)

completion = client.chat.completions.create(
  model="grok-3-beta",
  messages=[
    {"role": "user", "content": "What is the meaning of life?"}
  ]
)