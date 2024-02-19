import requests

res = requests.get('https://groups-api.dataporten.no/groups/groups', headers={
    'Authorization': 'Bearer 1fbac21b-b953-41a8-b9e5-25575d733c5c'
})

print(res.status_code)
print(res.text)