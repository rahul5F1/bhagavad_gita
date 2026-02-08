from flask import Flask, render_template, jsonify, request
import json
import random
import os
import unicodedata  # <--- NEW IMPORT

app = Flask(__name__)

# --- ROBUST DATA LOADING ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'gita_data.json')

GITA_DATA = []
if os.path.exists(DATA_FILE):
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            GITA_DATA = json.load(f)
            print(f"✅ Successfully loaded {len(GITA_DATA)} chapters.")
    except Exception as e:
        print(f"❌ Error loading JSON: {e}")
else:
    print(f"❌ Error: File not found at {DATA_FILE}")

# --- HELPER FUNCTION: REMOVE DIACRITICS ---
def normalize_text(text):
    """Converts 'kṛṣṇa' -> 'krsna', 'dhṛtarāṣṭra' -> 'dhrtarastra'"""
    if not text:
        return ""
    # Normalize unicode characters to separate accent marks
    text = unicodedata.normalize('NFD', text)
    # Filter out non-spacing mark characters (the accents)
    text = "".join([c for c in text if unicodedata.category(c) != 'Mn'])
    return text.lower().strip()

# --- ROUTES ---

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chapters')
def chapters_page():
    if not GITA_DATA:
        return render_template('chapters.html', chapters=[])

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

# --- SEARCH API ENDPOINT (SMART SEARCH) ---
@app.route('/api/search')
def search_verses():
    # 1. Get query and normalize it (e.g., user types "krsna")
    raw_query = request.args.get('q', '')
    query = normalize_text(raw_query)
    
    if not query:
        return jsonify([]) 
    
    results = []
    
    for chapter in GITA_DATA:
        for verse in chapter['verses']:
            # 2. Get DB content and normalize it (e.g., "kṛṣṇa" becomes "krsna")
            # English Text (Meaning)
            text_norm = normalize_text(verse.get('text', ''))
            
            # Transliteration (The English-Sanskrit)
            translit_norm = normalize_text(verse.get('transliteration', ''))
            
            # Sanskrit (The Devanagari)
            sanskrit_norm = normalize_text(verse.get('sanskrit', ''))
            
            # 3. Check for matches
            if (query in text_norm) or (query in translit_norm) or (query in sanskrit_norm):
                results.append({
                    'chapter_number': chapter['chapter_number'],
                    'chapter_title': chapter['title'],
                    'verse': verse['verse'],
                    'sanskrit': verse.get('sanskrit', ''),
                    'transliteration': verse.get('transliteration', ''),
                    'text': verse.get('text', '')
                })
    
    return jsonify(results)

@app.route('/api/oracle')
def oracle():
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
    
    if all_verses_flat:
        random_verse = random.choice(all_verses_flat)
        return jsonify(random_verse)
        
    return jsonify({"error": "The divine silence..."}), 404

# --- MOOD MAP ---
MOOD_MAP = {
    "anxious": [{"chapter": 18, "verse": 66}, {"chapter": 2, "verse": 47}],
    "angry": [{"chapter": 2, "verse": 63}, {"chapter": 16, "verse": 21}],
    "confused": [{"chapter": 2, "verse": 7}, {"chapter": 18, "verse": 61}],
    "depressed": [{"chapter": 2, "verse": 3}, {"chapter": 6, "verse": 5}],
    "lonely": [{"chapter": 9, "verse": 29}, {"chapter": 6, "verse": 30}],
    "fearful": [{"chapter": 4, "verse": 10}, {"chapter": 2, "verse": 40}]
}

@app.route('/api/mood/<string:emotion>')
def get_mood_verse(emotion):
    emotion = emotion.lower()
    possible_verses = MOOD_MAP.get(emotion)
    if not possible_verses: return jsonify({"error": "Emotion not found"}), 404
    
    target = random.choice(possible_verses)
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
