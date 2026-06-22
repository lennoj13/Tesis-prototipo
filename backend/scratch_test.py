def response_success():
    return {'data': []}, 200

try:
    resp = response_success()
    resp[0]['is_calculating'] = True
    print("Success:", resp)
except Exception as e:
    print("Error:", e)
