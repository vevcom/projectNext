import requests


PURCHASE_URL = "http://localhost/api/shop/purchase/createByStudentCard"
BARCODE_URL = "http://localhost/api/shop/product/barcode"

apiKey = "id=1&key=dev0f850abdffd827de51e2800b60f4073c13970054ba74f2118726087051"

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

response = requests.post(PURCHASE_URL, json=data, headers=headers)
print(response)
print(response.status_code)
print(response.headers)

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
