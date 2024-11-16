import requests


URL = "http://localhost/api/shop/purchase/createByStudentCard"

apiKey = "id=1&key=devf491fc632b8ce9dd0a5a948be2e3a9d7876129e37596ab25ea2a6082c0"

data = {
    "shopId": 1,
    "studentCard": "harambeCard",
    "products": [
        {"id": 1, "quantity": 2},
        {"id": 2, "quantity": 5}
    ]
}

headers = {
    "Content-Type": "application/json",  # Specifies JSON payload
    "Authorization": f"{apiKey}"  # Include if API requires authentication
}

response = requests.post(URL, json=data, headers=headers)
print(response)
print(response.status_code)
print(response.headers)

if (response.status_code == 200):
    print(response.json())
else:
    print(response.text)
