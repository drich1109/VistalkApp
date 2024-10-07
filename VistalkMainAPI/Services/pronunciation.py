""" import librosa
import numpy as np
from fastdtw import fastdtw
from flask import Flask, request, jsonify
import os
import soundfile as sf
from db import get_db_connection, PronunciationDirectory
from audio_similarity

def check_pronunciation():
    word = request.form.get('content')
    id = request.form.get('id')
    audio_file = request.files.get('audioFile')

    user_audio_path = os.path.join(PronunciationDirectory, 'user_audio.wav')
    audio_file.save(user_audio_path)

    reference_audio_path = fetch_reference_pronunciation(id)

    # Create an instance of AudioSimilarity
    audio_similarity = AudioSimilarity(reference_audio_path, user_audio_path)

    # Calculate the similarity score
    similarity_score = audio_similarity.calculate_similarity()

    feedback = generate_feedback()  # Implement this function based on your logic

    return jsonify({"word": word, "similarity_score": similarity_score, "feedback": feedback})

def fetch_reference_pronunciation(content_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT audiopath FROM content WHERE contentId = %s", (content_id,))
    row = cursor.fetchone()

    if row is None:
        raise ValueError(f"No reference pronunciation found for content ID {content_id}")

    return os.path.join(PronunciationDirectory, row[0])

def generate_feedback():
    feedback = "Keep practicing!"  # Placeholder feedback
    return feedback """