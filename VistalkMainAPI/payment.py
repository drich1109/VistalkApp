import requests
from flask import request, jsonify

def paymongoredirect():
    try:
        data = request.json
        amount = data.get('amount')
        description = data.get('description')
        amount_in_cents = int(float(amount) * 100)
        print(amount_in_cents)
        url = "https://api.paymongo.com/v1/links"

        payload = { "data": { "attributes": {
            "amount": amount_in_cents,
            "description": description,
            "remarks": "test"
        } } }

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Basic c2tfdGVzdF9nS1hlWVh0UlREZTR4Nkd1aWY5Rnk0UjM6"
        }

        response = requests.post(url, json=payload, headers=headers)
        print(response.reason)

        if response.status_code == 200:
            response_data = response.json()
            checkout_url = response_data['data']['attributes']['checkout_url']

            return jsonify({"url": checkout_url}), 200
        else:
            return jsonify({"error": "Failed to create payment link"}), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred"}), 500
    
""" def paymongo_webhook():
    data = request.json
    if data.get('status') == 'paid':
        payment_id = data.get('id')

        SocketIO.emit('paymentStatus', {'status': 'paid'}, room=payment_id)

        return jsonify({'message': 'Payment received and notified'}), 200
    return jsonify({'message': 'Payment not completed'}), 400 """