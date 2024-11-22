import requests


PURCHASE_URL = "http://localhost/api/shop/purchase/createByStudentCard"
BARCODE_URL = "http://localhost/api/shop/product/barcode"
READ_SHOPS_URL = "http://localhost/api/shop/getAll"
CONNECT_STUDENT_CARD_URL = "http://localhost/api/users/connectStudentCard"

apiKey = "id=1&key=deve74a7dc1d7479db2ddc42c7df79575b6912cfcc9b4aec8cfaafa7832a8"

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
    "Authorization": apiKey  # Include if API requires authentication
}

response = requests.post(PURCHASE_URL, json=data, headers=headers)
print(response.status_code)

if (response.status_code == 200):
    print(response.json())
else:
    print(response.text)

print("")

# Barcode: 7622210610416
# Barcode: 5410316983693

data2 = {
    "shopId": 1,
    "barcode": "5410316983693"
}

response = requests.post(BARCODE_URL, json=data2, headers=headers)

print(response.status_code)
if (response.status_code == 200):
    print(response.json())
else:
    print(response.text)

print()

headersSmall = {
    "Authorization": headers["Authorization"]
}
response = requests.get(READ_SHOPS_URL, headers=headersSmall)
print(response.status_code)
if (response.status_code == 200):
    print(response.json())
else:
    print(response.text)

print()
data3 = {
    "studentCard": "1234"
}
response = requests.post(CONNECT_STUDENT_CARD_URL, json=data3, headers=headers)
print(response.status_code)
print(response.json())
