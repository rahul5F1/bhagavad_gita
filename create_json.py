import json
import requests
import sys

# API Configuration
API_BASE_URL = "https://vedicscriptures.github.io/slok"
CHAPTER_VERSE_COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78]

# Full Chapter Metadata
CHAPTER_META = [
    {"title": "Arjuna Vishada Yoga", "translation": "Observing the Armies", "summary": "Arjuna sees his relatives and friends in the opposing army and is overcome with grief."},
    {"title": "Sankhya Yoga", "translation": "Contents of the Gita Summarized", "summary": "Krishna begins His teachings, explaining the distinction between the temporary body and the eternal soul."},
    {"title": "Karma Yoga", "translation": "The Yoga of Action", "summary": "Krishna explains that everyone must engage in some sort of activity in this material world."},
    {"title": "Jnana Karma Sanyasa Yoga", "translation": "Transcendental Knowledge", "summary": "The spiritual knowledge of the soul, of God, and of their relationship is revealed."},
    {"title": "Karma Sanyasa Yoga", "translation": "Karma Yoga - Action in Krishna Consciousness", "summary": "Outwardly performing all actions but inwardly renouncing their fruits."},
    {"title": "Dhyana Yoga", "translation": "The Yoga of Meditation", "summary": "Guidelines on yoga practice and the realization of the Paramatma (Supersoul)."},
    {"title": "Jnana Vijnana Yoga", "translation": "Knowledge of the Absolute", "summary": "Krishna reveals Himself as the source of all material and spiritual energies."},
    {"title": "Akshara Brahma Yoga", "translation": "Attaining the Supreme", "summary": "Explanation of the different paths the soul takes at the moment of death."},
    {"title": "Raja Vidya Raja Guhya Yoga", "translation": "The Most Confidential Knowledge", "summary": "Krishna explains His supreme nature and how He is attained through pure devotion."},
    {"title": "Vibhuti Yoga", "translation": "The Opulence of the Absolute", "summary": "Krishna describes His divine opulences and how He pervades all creation."},
    {"title": "Vishwarupa Darshana Yoga", "translation": "The Universal Form", "summary": "Arjuna is granted the divine vision to see Krishna's infinite universal form."},
    {"title": "Bhakti Yoga", "translation": "The Path of Devotion", "summary": "Krishna extols the path of pure love and devotion as the highest means to reach Him."},
    {"title": "Kshetra Kshetrajna Vibhaga Yoga", "translation": "Nature, the Enjoyer, and Consciousness", "summary": "The difference between the body (the field) and the soul (the knower of the field)."},
    {"title": "Gunatraya Vibhaga Yoga", "translation": "The Three Modes of Material Nature", "summary": "How the three modes (goodness, passion, ignorance) bind the soul."},
    {"title": "Purushottama Yoga", "translation": "The Yoga of the Supreme Person", "summary": "The purpose of Vedic knowledge is to detach oneself from the entanglement of the material world."},
    {"title": "Daivasura Sampad Vibhaga Yoga", "translation": "The Divine and Demoniac Natures", "summary": "Description of the divine and demoniac qualities present in human beings."},
    {"title": "Shraddhatraya Vibhaga Yoga", "translation": "The Divisions of Faith", "summary": "Faith determines the quality of life and the nature of one's worship."},
    {"title": "Moksha Sanyasa Yoga", "translation": "Conclusion - The Perfection of Renunciation", "summary": "Krishna's final instruction to surrender everything to Him and attain eternal peace."}
]

def get_verse_data(chapter, verse):
    """Fetches Sanskrit, Transliteration, and English Translation."""
    try:
        url = f"{API_BASE_URL}/{chapter}/{verse}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            
            # Fetch translation (prefer Sivananda)
            translation = "Translation not available."
            if 'siva' in data and 'et' in data['siva']: translation = data['siva']['et']
            elif 'purohit' in data and 'et' in data['purohit']: translation = data['purohit']['et']
            elif 'translation' in data: translation = data['translation']
            
            return {
                "verse": verse,
                "sanskrit": data.get('slok', ''),
                "transliteration": data.get('transliteration', ''),
                "text": translation
            }
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

print("🚀 Downloading Sanskrit, Transliteration, and English verses...")
all_chapters = []

for i, verse_count in enumerate(CHAPTER_VERSE_COUNTS):
    chapter_num = i + 1
    meta = CHAPTER_META[i]
    sys.stdout.write(f"\r   Processing Chapter {chapter_num}: {meta['title']}...")
    
    verses_list = []
    for v in range(1, verse_count + 1):
        v_data = get_verse_data(chapter_num, v)
        if v_data:
            verses_list.append(v_data)

    all_chapters.append({
        "chapter_number": chapter_num,
        "title": meta['title'],
        "translation": meta['translation'],
        "summary": meta['summary'],
        "verses": verses_list
    })

print("\n\n💾 Saving to gita_data.json...")
with open('gita_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_chapters, f, indent=4, ensure_ascii=False)

print("✅ DONE! Data file created.")