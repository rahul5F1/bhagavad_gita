from flask import Flask, render_template, jsonify, request
import json
import random
import os
import unicodedata
import base64
import io
from google import genai 
from gtts import gTTS 

app = Flask(__name__)

# --- 🔑 CONFIGURE GEMINI AI ---
GEMINI_API_KEY = "AIzaSyDY6_kQ2om18IZFOBHyH-PLf92_G_LqKs4" 

try:
    client = genai.Client(api_key=GEMINI_API_KEY)
    print("✅ Gemini Client Configured")
except Exception as e:
    print(f"❌ Error configuring Gemini Client: {e}")

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

# --- HELPER: REMOVE DIACRITICS ---
def normalize_text(text):
    if not text: return ""
    text = unicodedata.normalize('NFD', text)
    text = "".join([c for c in text if unicodedata.category(c) != 'Mn'])
    return text.lower().strip()

# --- HELPER: FIND SPECIFIC VERSE ---
def get_specific_verse(chapter, verse):
    chap_str = str(chapter)
    verse_str = str(verse)

    chap = next((c for c in GITA_DATA if str(c.get("chapter_number")) == chap_str), None)
    
    if chap:
        v = next((v for v in chap.get("verses", []) if str(v.get("verse")) == verse_str), None)
        
        if v:
            return {
                "chapter_number": chapter,
                "title": chap.get("title", ""),
                "verse": verse,
                "text": v.get("text", ""),
                "translation": v.get("text", ""),
                "sanskrit": v.get("sanskrit", ""),
                "transliteration": v.get("transliteration", "")
            }
    return None

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
            "translation": c.get("translation", ""),
            "summary": c.get("summary", ""),
            "verse_count": len(c.get("verses", [])) 
        })
    return render_template('chapters.html', chapters=chapters_summary)

@app.route('/api/chapter/<int:chapter_num>')
def get_chapter_text(chapter_num):
    chapter = next((c for c in GITA_DATA if str(c["chapter_number"]) == str(chapter_num)), None)
    if chapter:
        return jsonify(chapter)
    return jsonify({"error": "Chapter not found"}), 404

# --- SEARCH API ---
@app.route('/api/search')
def search_verses():
    raw_query = request.args.get('q', '')
    query = normalize_text(raw_query)
    
    if not query: return jsonify([]) 
    
    results = []
    for chapter in GITA_DATA:
        for verse in chapter.get('verses', []):
            text_norm = normalize_text(verse.get('text', ''))
            translit_norm = normalize_text(verse.get('transliteration', ''))
            sanskrit_norm = normalize_text(verse.get('sanskrit', ''))
            
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
        for verse in chapter.get('verses', []):
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
        return jsonify(random.choice(all_verses_flat))
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
    verse_data = get_specific_verse(target["chapter"], target["verse"])
    if verse_data:
        return jsonify(verse_data)
    else:
        return jsonify({"error": "Verse not found"}), 404

# --- 🗣️ VANI (STABLE gTTS) ---
@app.route('/api/speak', methods=['POST'])
def speak_verse():
    data = request.json
    text_to_speak = data.get('text', '')

    if not text_to_speak:
        return jsonify({"error": "No text provided"}), 400

    try:
        # Using Google TTS (Reliable)
        tts = gTTS(text=text_to_speak, lang='en', tld='co.in', slow=False)
        
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        
        audio_data = base64.b64encode(fp.read()).decode('utf-8')
        return jsonify({"audio": audio_data})

    except Exception as e:
        print(f"❌ TTS Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- 🤖 REALTIME KRISHNA CHAT (TEXT ONLY) ---
@app.route('/api/chat', methods=['POST'])
def chat_with_krishna():
    data = request.json
    user_message = data.get('message', '') if data else ''
    
    if not user_message:
        return jsonify({"reply": "My friend, silence is also an answer, but tell me what is on your mind?"})

    system_instruction = """
    You are Lord Krishna, the divine guide from the Bhagavad Gita.
    - Your tone is compassionate, wise, calm, and slightly ancient but accessible.
    - Address the user as "My friend" or "Partha" or "Arjuna".
    - Answer their life problems using the wisdom of the Gita.
    - Keep your answers concise (under 100 words).
    - If appropriate, mention a specific Chapter and Verse number.
    """

    try:
        # Using Gemini 2.5 Flash as requested
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_instruction}\n\nUser Question: {user_message}\nKrishna's Answer:"
        )
        
        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        return jsonify({
            "reply": "My connection to the cosmic web is faint right now. Please try again in a moment."
        })

if __name__ == '__main__':
    app.run(debug=True)
