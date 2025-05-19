import requests

API_KEY = "N8394eNT5scvXaqs7g6Pm0TcOGb7lveP"
CITY = "Ho Chi Minh"

districts = [
    "Binh Thanh",
    "Go Vap",
    "Phu Nhuan",
    "Tan Binh",
    "Tan Phu",
    "Binh Tan",
    "Thu Duc",     # Thành phố Thủ Đức
    "Nha Be",
    "Hoc Mon",
    "Binh Chanh",
    "Cu Chi",
    "Can Gio"
]

district_keys = {}

for district in districts:
    query = f"{district} {CITY}"
    url = "https://dataservice.accuweather.com/locations/v1/cities/search"
    params = {
        "apikey": API_KEY,
        "q": query
    }
    response = requests.get(url, params=params)
    data = response.json()
    
    if data and isinstance(data, list) and "Key" in data[0]:
        location_key = data[0]["Key"]
        print(f"{district}: {location_key}")
        district_keys[district] = location_key
    else:
        print(f"{district}: Not found")
        district_keys[district] = None

print("\nAll district location keys:")
for district, key in district_keys.items():
    print(f"{district}: {key}")
