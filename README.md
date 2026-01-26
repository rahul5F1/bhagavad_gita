# 🕉️ Divine Dialogue: Srimad Bhagavad Gita

> "The Divine Song of God" — A spiritual companion web application that brings the wisdom of the Bhagavad Gita to the modern digital age.

**Divine Dialogue** is an interactive spiritual experience featuring a 3D "Glassmorphism" UI, mood-based guidance ("The Soul Doctor"), and a fully immersive "Cosmic Mode" with dynamic, twinkling stars.

---

## ✨ Key Features

* **📖 Complete Wisdom:** Access all 18 Chapters and 700 Verses with Sanskrit text, Transliteration, and English translations.
* **🩺 The Soul Doctor:** An interactive "Mood Tracker" that prescribes verses based on your emotions (Anxious, Angry, Confused, etc.).
* **✨ The Oracle:** A "Random Verse" generator for divine guidance.
* **🌌 Cosmic Mode:** A dynamic toggle that transforms the site into a Deep Space theme with twinkling stars.
* **📱 Fully Responsive:** Optimized for Mobile, Tablet, and Laptops.

---

## 📂 Project Structure

```text
/Gita-Project
│
├── app.py                # The Main Flask Server
├── create_json.py        # Data generation script
├── gita_data.json        # The Database of verses
│
├── templates/
│   ├── index.html        # Landing Page
│   └── chapters.html     # Main Reading Interface
│
└── static/
    ├── style.css         # Styling (Day/Cosmic Modes)
    ├── script.js         # Frontend Logic
    ├── krishna_bg.jpg    # Landing Background
    └── texture_bg.jpg    # Day Background
