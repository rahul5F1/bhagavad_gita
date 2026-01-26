from flask import Flask, render_template, jsonify
import json
import random
import os

app = Flask(__name__)

# --- LOAD DATA STARTUP (VERCEL FIX) ---
# We use an absolute path so Vercel can find the file correctly.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'gita_data.json')

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
    chapters_summary = []
    for c in GITA_DATA:
        chapters_summary.append({
            "chapter_number": c["chapter_number"],
            "title": c["title"],
            "translation": c["translation"],
            "summary": c["summary"],
            "verse_count": len(c["verses"]) 
        })
    return render_template('chapters.html', chapters=chapters_summary)

@app.route('/api/chapter/<int:chapter_num>')
def get_chapter_text(chapter_num):
    chapter = next((c for c in GITA_DATA if c["chapter_number"] == chapter_num), None)
    
    if chapter:
        return jsonify(chapter)
    return jsonify({"error": "Chapter not found"}), 404

@app.route('/api/oracle')
def oracle():
    # 1. Flatten the list: Get all verses out of their chapters
    all_verses_flat = []
    
    for chapter in GITA_DATA:
        for verse in chapter['verses']:
            verse_obj = {
                "chapter_number": chapter['chapter_number'],
                "title": chapter['title'],
                "verse": verse['verse'],
                "text": verse['text'],
                "sanskrit": verse.get('sanskrit', ''),           
                "transliteration": verse.get('transliteration', '') 
            }
            all_verses_flat.append(verse_obj)
    
    # 2. Sample: Pick 1 random verse
    if all_verses_flat:
        random_verse = random.choice(all_verses_flat)
        return jsonify(random_verse)
        
    return jsonify({"error": "The divine silence..."}), 404

# --- MOOD MAPPING ---
MOOD_MAP = {
    "anxious": [
        {"chapter": 18, "verse": 66},
        {"chapter": 2, "verse": 47},
        {"chapter": 9, "verse": 22},
        {"chapter": 2, "verse": 14}
    ],
    "angry": [
        {"chapter": 2, "verse": 63},
        {"chapter": 16, "verse": 21},
        {"chapter": 2, "verse": 56},
        {"chapter": 5, "verse": 26}
    ],
    "confused": [
        {"chapter": 2, "verse": 7},
        {"chapter": 18, "verse": 61},
        {"chapter": 4, "verse": 34},
        {"chapter": 10, "verse": 10}
    ],
    "depressed": [
        {"chapter": 2, "verse": 3},
        {"chapter": 6, "verse": 5},
        {"chapter": 2, "verse": 11},
        {"chapter": 18, "verse": 58}
    ],
    "lonely": [
        {"chapter": 9, "verse": 29},
        {"chapter": 6, "verse": 30},
        {"chapter": 10, "verse": 20},
        {"chapter": 13, "verse": 16}
    ],
    "fearful": [
        {"chapter": 4, "verse": 10},
        {"chapter": 2, "verse": 40},
        {"chapter": 11, "verse": 50},
        {"chapter": 18, "verse": 78}
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

# --- DEBUG ROUTE (Delete this later) ---
@app.route('/debug-files')
def debug_files():
    import os
    # List all files in the current directory on the server
    files = os.listdir(os.getcwd())
    return jsonify({
        "current_directory": os.getcwd(),
        "files_found": files,
        "does_json_exist": os.path.exists(os.path.join(os.getcwd(), 'gita_data.json'))
    })

if __name__ == '__main__':
    app.run(debug=True)

