import requests


URL = "http://localhost/api/shop/purchase/createByStudentCard"

apiKey = "id=4&key=dev9b47fbcfa7548e7bcd19cec343f4c7221c2670f7159b2654686a086858"

data = {
    "shopId": 1,
    "NTNUCard": "ABC123",
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
print(response.text)
