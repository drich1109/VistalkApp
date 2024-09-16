from pydub import AudioSegment
from pydub.silence import split_on_silence
import librosa
import numpy as np
from flask import request, jsonify
import os

def remove_silence(audio_path):
    audio = AudioSegment.from_file(audio_path)
    chunks = split_on_silence(audio, silence_thresh=-40)
    
    # Save the trimmed audio to a new file
    trimmed_audio = sum(chunks)
    trimmed_audio_path = audio_path.replace(".wav", "_trimmed.wav")
    trimmed_audio.export(trimmed_audio_path, format="wav")

    return trimmed_audio_path

def extract_features(audio_path):
    y, sr = librosa.load(audio_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return mfccs

def calculate_similarity(user_audio_path, reference_audio_path):
    user_features = extract_features(user_audio_path)
    reference_features = extract_features(reference_audio_path)
    
    # Use Dynamic Time Warping (DTW) to compare the two feature sets
    dtw_distance, _ = librosa.sequence.dtw(X=user_features, Y=reference_features, metric='euclidean')
    normalized_distance = np.mean(dtw_distance)
    
    # Print DTW distance for debugging
    print(f"DTW Distance: {normalized_distance}")
    
    # Increase max_distance if necessary
    max_distance = 300  # Adjust this value based on your observations
    similarity_score = max(0, max_distance - normalized_distance) / max_distance * 100

    return similarity_score

def check_pronunciation():
    user_audio = request.files['audio']
    print(user_audio)
    user_audio_directory = 'C:\\VistalkApp\\VistalkApp\\VistalkMainAPI\\Test'
    safe_filename = "Test.wav"

    # Create directory if it doesn't exist
    if not os.path.exists(user_audio_directory):
        os.makedirs(user_audio_directory)

    # Combine directory and filename to create the full path
    audio_file_path = os.path.join(user_audio_directory, safe_filename)
    print(audio_file_path)

    # Save the audio file to the specified path
    user_audio.save(audio_file_path)

    trimmed_user_audio_path = remove_silence(audio_file_path)
    reference_audio_path = 'C:\\VistalkApp\\VistalkApp\\Vistalk Pronunciation Audio\\amahan.wav'
    score = calculate_similarity(trimmed_user_audio_path, reference_audio_path)

    return jsonify({
        'isSuccess': True,
        'message': 'Pronunciation checked successfully',
        'score': score
    }), 200
