from flask import Flask, render_template, jsonify
import json
import random
import os

app = Flask(__name__)

# --- LOAD DATA STARTUP ---
# This replaces the database connection.
# We load the file into memory once. It is very fast.
DATA_FILE = 'gita_data.json'

if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        GITA_DATA = json.load(f)
else:
    print("❌ Error: gita_data.json not found. Please run create_json.py first.")
    GITA_DATA = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chapters')
def chapters_page():
    # In MongoDB we used projection to hide verses.
    # In JSON, passing the whole object is fine, but if you want to be strict,
    # we can create a lightweight list for the menu:
    chapters_summary = []
    for c in GITA_DATA:
        chapters_summary.append({
            "chapter_number": c["chapter_number"],
            "title": c["title"],
            "translation": c["translation"],
            "summary": c["summary"],
            # NEW: Calculate length of the verses list
            "verse_count": len(c["verses"]) 
        })
    return render_template('chapters.html', chapters=chapters_summary)

@app.route('/api/chapter/<int:chapter_num>')
def get_chapter_text(chapter_num):
    # Find the chapter in the list where chapter_number matches
    # This replaces: collection.find_one(...)
    chapter = next((c for c in GITA_DATA if c["chapter_number"] == chapter_num), None)
    
    if chapter:
        return jsonify(chapter)
    return jsonify({"error": "Chapter not found"}), 404

@app.route('/api/oracle')
def oracle():
    # This Logic replaces the MongoDB Aggregation Pipeline ($unwind, $sample)
    
    # 1. Flatten the list: Get all verses out of their chapters
    all_verses_flat = []
    
    for chapter in GITA_DATA:
        for verse in chapter['verses']:
            # We create a new object that looks EXACTLY like the 
            # MongoDB $project output your frontend expects
            verse_obj = {
                "chapter_number": chapter['chapter_number'],
                "title": chapter['title'],
                "verse": verse['verse'],
                "text": verse['text'],
                "sanskrit": verse.get('sanskrit', ''),           # Includes Sanskrit
                "transliteration": verse.get('transliteration', '') # Includes Transliteration
            }
            all_verses_flat.append(verse_obj)
    
    # 2. Sample: Pick 1 random verse
    if all_verses_flat:
        random_verse = random.choice(all_verses_flat)
        return jsonify(random_verse)
        
    return jsonify({"error": "The divine silence..."}), 404

# --- MOOD MAPPING ---
# Specific verses that address these emotions
MOOD_MAP = {
    "anxious": [
        {"chapter": 18, "verse": 66}, # Abandon all varieties of religion
        {"chapter": 2, "verse": 47},  # You have a right to perform your prescribed duty
        {"chapter": 9, "verse": 22},  # I carry what they lack
        {"chapter": 2, "verse": 14}   # The nonpermanent appearance of happiness and distress
    ],
    "angry": [
        {"chapter": 2, "verse": 63},  # From anger, complete delusion arises
        {"chapter": 16, "verse": 21}, # There are three gates leading to this hell
        {"chapter": 2, "verse": 56},  # One who is free from attachment, fear and anger
        {"chapter": 5, "verse": 26}   # Those who are free from anger and all material desires
    ],
    "confused": [
        {"chapter": 2, "verse": 7},   # Now I am confused about my duty
        {"chapter": 18, "verse": 61}, # The Supreme Lord is situated in everyone's heart
        {"chapter": 4, "verse": 34},  # Just try to learn the truth by approaching a spiritual master
        {"chapter": 10, "verse": 10}  # To those who are constantly devoted... I give the understanding
    ],
    "depressed": [
        {"chapter": 2, "verse": 3},   # Do not yield to this degrading impotence
        {"chapter": 6, "verse": 5},   # One must deliver himself with the help of his mind
        {"chapter": 2, "verse": 11},  # While speaking learned words, you are mourning 
        {"chapter": 18, "verse": 58}  # If you become conscious of Me, you will pass over all obstacles
    ],
    "lonely": [
        {"chapter": 9, "verse": 29},  # I envy no one, nor am I partial to anyone
        {"chapter": 6, "verse": 30},  # For one who sees Me everywhere... I am never lost
        {"chapter": 10, "verse": 20}, # I am the Self, seated in the hearts of all creatures
        {"chapter": 13, "verse": 16}  # The Supreme Truth exists outside and inside of all living beings
    ],
    "fearful": [
        {"chapter": 4, "verse": 10},  # Being freed from attachment, fear and anger
        {"chapter": 2, "verse": 40},  # In this endeavor there is no loss or diminution
        {"chapter": 11, "verse": 50}, # Be free from all disturbance
        {"chapter": 18, "verse": 78}  # Wherever there is Krishna... there will also be victory
    ]
}

@app.route('/api/mood/<string:emotion>')
def get_mood_verse(emotion):
    emotion = emotion.lower()
    
    # 1. Get the LIST of possible verses for this emotion
    possible_verses = MOOD_MAP.get(emotion)
    
    if not possible_verses:
        return jsonify({"error": "Emotion not found"}), 404

    # 2. Randomly pick ONE verse from that list
    target = random.choice(possible_verses)

    # 3. Find the specific verse in our JSON data
    chapter_data = next((c for c in GITA_DATA if c["chapter_number"] == target["chapter"]), None)
    
    if chapter_data:
        verse_data = next((v for v in chapter_data["verses"] if v["verse"] == target["verse"]), None)
        
        if verse_data:
            return jsonify({
                "chapter_number": chapter_data["chapter_number"],
                "title": chapter_data["title"],
                "verse": verse_data["verse"],
                "text": verse_data["text"],
                "sanskrit": verse_data.get("sanskrit", ""),
                "transliteration": verse_data.get("transliteration", "")
            })

    return jsonify({"error": "Verse not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)