import requests

res = requests.get('https://groups-api.dataporten.no/groups/me/groups', headers={
    'Authorization': 'Bearer 85d5f269-0dba-4971-9bf2-cf6c438f22ed'
})

print(res.status_code)
print(res.text)