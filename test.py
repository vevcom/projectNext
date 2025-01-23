import requests

READ_SHOPS_URL = "http://localhost/api/shop/getAll"
PURCHASE_URL = "http://localhost/api/shop/purchase/createByStudentCard"
API_KEY = "id=1&key=devd78cb32f3cebf5ca91f357625d817e63f8d9cde384e534f9f6993c8217"

data = {
    "shopId": 1,
    "studentCard": "harambeCard",
    "products": [
        {"id": 1, "quantity": 2},
        {"id": 2, "quantity": 5}
    ]
}

headers = {
    "Authorization": API_KEY
}

response = requests.post(PURCHASE_URL, json=data, headers=headers)

if (response.status_code == 200):
    print(response.json())
else:
    print(response.json())
