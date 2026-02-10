# 🕉️ Divine Dialogue: Srimad Bhagavad Gita

> "The Divine Song of God" — A spiritual companion web application that brings the wisdom of the Bhagavad Gita to the modern digital age.

---

## ✨ Key Features

* **🐚 The "Vishwaroopam" Entrance:** A cinematic landing experience featuring a 3D Cosmic Warp. Holding the Shankh triggers a hyper-speed starfield transition, violent camera shake, and a seamless orchestral audio blast that transports users into the divine realm.
* **🔊 "Vani" Divine Audio Engine:** A custom-built Web Audio API engine that transforms standard text-to-speech into a Divine Temple Voice. It applies real-time Pitch Correction (0.85x) and Convolution Reverb (Echo) to simulate the acoustics of a vast, ancient sanctuary.
* **📖 Complete Wisdom:** Access all 18 Chapters and 700 Verses with the original Sanskrit text, phonetic Transliteration, and clear English translations.
* **🎵 Synchronized Mantra Visualizer:** A dynamic, golden wave animation in the reading modal that reacts in real-time, vibrating only when the divine verse is being chanted.
* **📸 Insta-Wisdom:** Generate and Download high-quality verse cards instantly. The app renders the Sanskrit and English text onto a divine background, ready for WhatsApp Status or Instagram Stories.
* **🤖 Krishna's Counsel (Gemini AI):** A contextual, resizable AI chatbot companion. It adopts the persona of Lord Krishna to answer your life's specific problems with compassion and wisdom derived directly from the Gita.
* **🩺 The Soul Doctor:** An interactive "Mood Tracker" that prescribes specific verses as medicine for your emotions (e.g., For Anxiety → Chapter 2, Verse 47).
* **🔍 Dharma Search Engine:** A powerful search tool that finds verses instantly using keywords in English, Transliteration (e.g., 'Karmanye'), or Original Sanskrit (Devanagari).
* **🌌 Cosmic Gyroscope:** An immersive background system that reacts to Mouse Movement (Desktop) and Device Tilt/Gyroscope (Mobile), creating a parallax 3D depth effect.
* **📱 Zero-Overlap Design:** A fully responsive, Flexbox-based architecture ensuring the UI elements (Footer, Cards, Modals) never overlap, providing a flawless experience on Mobile, Tablet, and Desktop.

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

### 3. Install dependencies
Open your terminal (Command Prompt) and install the dependencies:

```bash
pip install -r requirements.txt
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
