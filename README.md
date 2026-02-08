# 🕉️ Divine Dialogue: Srimad Bhagavad Gita

> "The Divine Song of God" — A spiritual companion web application that brings the wisdom of the Bhagavad Gita to the modern digital age.

**Divine Dialogue** is an interactive spiritual experience featuring a 3D "Glassmorphism" UI, mood-based guidance ("The Soul Doctor"), and a fully immersive "Cosmic Mode" with dynamic, twinkling stars.

---

## ✨ Key Features

* **📖 Complete Wisdom:** Access all 18 Chapters and 700 Verses with Sanskrit text, Transliteration, and English translations.
* **🔊 Voice of Wisdom:** Listen to the **Sanskrit Shlokas** chanted with authentic pronunciation (using advanced Text-to-Speech integration).
* **📸 Insta-Wisdom:** Generate and **Download beautiful shareable cards** of any verse with a divine background, perfect for WhatsApp Status or Instagram.
* **🩺 The Soul Doctor:** An interactive "Mood Tracker" that prescribes verses based on your emotions (Anxious, Angry, Confused, etc.).
* **🔍 Dharma Search Engine: Instantly find specific verses by searching in English (meaning), Phonetic Transliteration (e.g., 'Karmanye'), or Original Sanskrit (Devanagari).
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

```

---

## 🚀 How to Run Locally

Follow these steps to run **Divine Dialogue** on your computer.

### 1. Prerequisites
Make sure you have **Python** installed.

### 2. Clone or Download
Download this project folder to your computer.

### 3. Install Flask
Open your terminal (Command Prompt) and install the Flask framework:

```bash
pip install flask
```

### 4. Run the Application
Navigate to your project folder in the terminal and run:

```bash
python app.py
```

5. Open in Browser
You will see a message saying "Running on http://127.0.0.1:5000". Open that link in Chrome or Edge.

---

### 🎨 Customization
Change Images: Replace krishna_bg.jpg or texture_bg.jpg in the static folder to change the backgrounds.

Modify Verses: You can edit gita_data.json if you wish to correct or change translations.

---

### 🙏 Credits
Designed & Developed with Devotion by Rahul Rathod

May this application bring peace and wisdom to all who visit.

Hare Krishna! 🕉️
