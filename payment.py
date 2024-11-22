import requests
from flask import request, jsonify
import hmac
import hashlib
from app import socketio

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
    
def handle_webhook():
    try:
        payload = request.get_data(as_text=True)
        received_signature = request.headers.get('PayMongo-Signature', '')

        secret_key = "whsk_4PSib83vzDep1kqV64UcvMxM"
        print('here')
        computed_signature = hmac.new(
            secret_key.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        print('here2')

        data = request.json
        print(data)
        event_type = data['data']['attributes']['type']
        
        if event_type == "payment.paid":
            print(f"Payment status: Success")
            user_email = data['data']['attributes']['data']['attributes']['billing']['email']

            socketio.emit('payment_status_update', {
                'status': 'paid',
            }, room=user_email)
            
            return jsonify({"message": "Webhook handled successfully"}), 200
        else:
            return jsonify({"message": "Event not handled"}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred"}), 500
