// 1. Staggered Entrance Animation on Load
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.chapter-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Check Theme Preference
    const savedTheme = localStorage.getItem("theme");
    const toggle = document.getElementById("cosmicToggle");
    if (savedTheme === "cosmic") {
        document.body.classList.add("cosmic-mode");
        if(toggle) toggle.checked = true;
    }
});

// 2. Open Chapter Modal
function openChapter(chapterNum) {
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    modalText.innerHTML = '<div style="text-align:center; padding: 50px; color: var(--saffron);">Loading Divine Verses...</div>';

    fetch(`/api/chapter/${chapterNum}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                modalText.innerHTML = "<p>Error loading chapter.</p>";
            } else {
                modalTitle.innerText = `Chapter ${data.chapter_number}: ${data.title}`;
                modalSubtitle.innerText = data.translation;
                
                let versesHtml = "";
                
                data.verses.forEach(v => {
                    // SAFE DATA PREPARATION
                    // We escape quotes (&quot;) so they don't break the HTML attributes
                    const safeSanskrit = v.sanskrit ? v.sanskrit.replace(/"/g, '&quot;') : "";
                    const safeText = v.text.replace(/"/g, '&quot;');
                    const safeTransliteration = v.transliteration ? v.transliteration.replace(/"/g, '&quot;') : "";
                    const safeTitle = data.title.replace(/"/g, '&quot;');
                    
                    versesHtml += `
                        <div class="verse-item">
                            <span class="verse-number">Verse ${v.verse}</span>
                            <div class="sanskrit-text">${v.sanskrit}</div>
                            <div class="transliteration-text">${v.transliteration}</div>
                            <p class="translation-text">${v.text}</p>
                            
                            <div class="action-bar">
                                <button class="action-btn" onclick="playAudio(this.getAttribute('data-text'))" data-text="${safeSanskrit}">
                                    🔊 Listen
                                </button>
                                
                                <button class="action-btn" onclick="copyVerse('${v.verse}', this.getAttribute('data-text'))" data-text="${safeText}">
                                    📋 Copy
                                </button>
                                
                                <button class="action-btn" onclick="triggerDownload(this)"
                                    data-chapter="${data.chapter_number}"
                                    data-title="${safeTitle}"
                                    data-verse="${v.verse}"
                                    data-sanskrit="${safeSanskrit}"
                                    data-transliteration="${safeTransliteration}"
                                    data-translation="${safeText}">
                                    📸 Download
                                </button>
                            </div>
                        </div>
                    `;
                });
                modalText.innerHTML = versesHtml;
            }
        })
        .catch(err => {
            console.error(err);
            modalText.innerHTML = "<p>Failed to load content.</p>";
        });
}

// 3. Close Modal
function closeChapter() {
    window.speechSynthesis.cancel(); 
    const modal = document.getElementById("readingModal");
    modal.classList.remove("show");
    setTimeout(() => { modal.style.display = "none"; }, 400);
}

// 4. Close on Click Outside
window.onclick = function(event) {
    const modal = document.getElementById("readingModal");
    if (event.target == modal) {
        closeChapter();
    }
}

// --- ORACLE FUNCTION ---
function askOracle() {
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    modalText.innerHTML = '<div style="text-align:center; padding: 50px; font-size: 1.5rem; color: var(--saffron);">Consulting the Divine...</div>';
    modalTitle.innerText = "Krishna Answers";
    modalSubtitle.innerText = "Reflect on this verse for your guidance";

    fetch('/api/oracle')
        .then(response => response.json())
        .then(data => {
            modalTitle.innerText = `Guidance from Chapter ${data.chapter_number}`;
            modalSubtitle.innerText = data.title;
            
            const safeSanskrit = data.sanskrit ? data.sanskrit.replace(/"/g, '&quot;') : "";
            const safeText = data.text.replace(/"/g, '&quot;');
            const safeTransliteration = data.transliteration ? data.transliteration.replace(/"/g, '&quot;') : "";
            const safeTitle = data.title.replace(/"/g, '&quot;');

            modalText.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <span style="font-family: 'Cinzel', serif; color: var(--saffron); font-size: 1.2rem; display: block; margin-bottom: 20px;">
                        Verse ${data.verse}
                    </span>
                    <div class="sanskrit-text" style="font-size: 1.5rem;">${data.sanskrit || ''}</div>
                    <div class="transliteration-text">${data.transliteration || ''}</div>
                    <p style="font-size: 1.4rem; line-height: 1.8; font-style: italic; color: var(--krishna-blue); margin-top: 20px;">
                        "${data.text}"
                    </p>
                    
                    <div class="action-bar">
                        <button class="action-btn" onclick="playAudio(this.getAttribute('data-text'))" data-text="${safeSanskrit}">
                            🔊 Listen
                        </button>
                        <button class="action-btn" onclick="copyVerse('${data.verse}', this.getAttribute('data-text'))" data-text="${safeText}">
                            📋 Copy
                        </button>
                        
                        <button class="action-btn" onclick="triggerDownload(this)"
                            data-chapter="${data.chapter_number}"
                            data-title="${safeTitle}"
                            data-verse="${data.verse}"
                            data-sanskrit="${safeSanskrit}"
                            data-transliteration="${safeTransliteration}"
                            data-translation="${safeText}">
                            📸 Download
                        </button>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            console.error(err);
            modalText.innerHTML = "<p>The connection to the divine was interrupted.</p>";
        });
}

// --- MOOD DOCTOR FUNCTION ---
function askMood(emotion) {
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    modalText.innerHTML = '<div style="text-align:center; padding: 50px; font-size: 1.5rem; color: var(--saffron);">Finding comfort for your soul...</div>';
    modalTitle.innerText = "The Divine Remedy";
    modalSubtitle.innerText = `For when you are feeling ${emotion}`;

    fetch(`/api/mood/${emotion}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                modalText.innerHTML = "<p>Peace be with you. Try again later.</p>";
            } else {
                modalTitle.innerText = `Chapter ${data.chapter_number}: ${data.title}`;
                
                const safeSanskrit = data.sanskrit ? data.sanskrit.replace(/"/g, '&quot;') : "";
                const safeText = data.text.replace(/"/g, '&quot;');
                const safeTransliteration = data.transliteration ? data.transliteration.replace(/"/g, '&quot;') : "";
                const safeTitle = data.title.replace(/"/g, '&quot;');

                modalText.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <span style="font-family: 'Cinzel', serif; color: var(--saffron); font-size: 1.2rem; display: block; margin-bottom: 20px;">
                            Verse ${data.verse}
                        </span>
                        <div class="sanskrit-text" style="font-size: 1.5rem;">${data.sanskrit || ''}</div>
                        <div class="transliteration-text">${data.transliteration || ''}</div>
                        <p style="font-size: 1.4rem; line-height: 1.8; font-style: italic; color: var(--krishna-blue); margin-top: 20px;">
                            "${data.text}"
                        </p>
                        
                        <div class="action-bar">
                            <button class="action-btn" onclick="playAudio(this.getAttribute('data-text'))" data-text="${safeSanskrit}">
                                🔊 Listen
                            </button>
                            <button class="action-btn" onclick="copyVerse('${data.verse}', this.getAttribute('data-text'))" data-text="${safeText}">
                                📋 Copy
                            </button>
                            
                            <button class="action-btn" onclick="triggerDownload(this)"
                                data-chapter="${data.chapter_number}"
                                data-title="${safeTitle}"
                                data-verse="${data.verse}"
                                data-sanskrit="${safeSanskrit}"
                                data-transliteration="${safeTransliteration}"
                                data-translation="${safeText}">
                                📸 Download
                            </button>
                        </div>
                    </div>
                `;
            }
        })
        .catch(err => {
            console.error(err);
            modalText.innerHTML = "<p>Connection error.</p>";
        });
}

// --- COSMIC TOGGLE LOGIC ---
function toggleCosmicMode() {
    const body = document.body;
    const toggle = document.getElementById("cosmicToggle");
    
    if (toggle.checked) {
        body.classList.add("cosmic-mode");
        localStorage.setItem("theme", "cosmic"); 
    } else {
        body.classList.remove("cosmic-mode");
        localStorage.setItem("theme", "day"); 
    }
}

// --- COPY FUNCTION ---
function copyVerse(verseNum, textToCopy) {
    const fullText = `Bhagavad Gita Verse ${verseNum}: "${textToCopy}"`;
    navigator.clipboard.writeText(fullText).then(() => {
        showToast("Verse Copied to Clipboard! 📋"); 
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// --- TOAST NOTIFICATION ---
function showToast(message) {
    var toast = document.getElementById("toast");
    toast.className = "toast show";
    toast.innerText = message || "Notification";
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

/* =========================================
   🔊 VOICE OF WISDOM (Sanskrit Engine)
   ========================================= */
function playAudio(text) {
    window.speechSynthesis.cancel();
    let cleanText = text.replace(/\|\|.*?\|\|/g, "").replace(/[0-9.-]/g, "").trim();
    let utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi'));
    if (hindiVoice) { utterance.voice = hindiVoice; utterance.lang = 'hi-IN'; } 
    else { utterance.lang = 'hi-IN'; }
    utterance.rate = 0.85; 
    utterance.pitch = 1.0; 
    window.speechSynthesis.speak(utterance);
}

/* =========================================
   📸 DOWNLOAD IMAGE FEATURE (Robut Fix)
   ========================================= */
// 1. Trigger Function: Reads data from the button and calls the generator
function triggerDownload(btn) {
    const chapNum = btn.getAttribute('data-chapter');
    const chapTitle = btn.getAttribute('data-title');
    const verseNum = btn.getAttribute('data-verse');
    const sanskrit = btn.getAttribute('data-sanskrit');
    const transliteration = btn.getAttribute('data-transliteration');
    const translation = btn.getAttribute('data-translation');
    
    downloadVerseImage(chapNum, chapTitle, verseNum, sanskrit, transliteration, translation);
}

// 2. Generator Function: Creates the image
function downloadVerseImage(chapNum, chapTitle, verseNum, sanskrit, transliteration, translation) {
    showToast("Generating Image... 🎨");

    // Populate the hidden card
    document.getElementById('print-chapter-info').innerText = `Chapter ${chapNum}: ${chapTitle}`;
    document.getElementById('print-verse-num').innerText = `Verse ${verseNum}`;
    document.getElementById('print-sanskrit').innerText = sanskrit || "";
    document.getElementById('print-transliteration').innerText = transliteration || "";
    document.getElementById('print-translation').innerText = `"${translation}"`;

    const container = document.getElementById('printable-card-container');

    // Generate Screenshot
    html2canvas(container, {
        useCORS: true, // Needed for external images
        scale: 2,       // High quality
        backgroundColor: null // Keeps transparency/background logic handled by CSS
    }).then(canvas => {
        const imageUri = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.setAttribute("href", imageUri);
        link.setAttribute("download", `Gita-Ch${chapNum}-V${verseNum}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Image Downloaded! 📸");
    }).catch(err => {
        console.error("Image generation failed:", err);
        showToast("Failed to generate image. 😞");
    });
}

/* =========================================
   🔍 DHARMA SEARCH ENGINE
   ========================================= */

// 1. Handle "Enter" key press
function handleEnter(event) {
    if (event.key === "Enter") {
        performSearch();
    }
}

// 2. Perform the Search
function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    // Use the existing Modal to show results
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    // Open Modal
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    // Loading State
    modalText.innerHTML = '<div style="text-align:center; padding: 50px; color: var(--saffron);">Searching the Scriptures...</div>';
    modalTitle.innerText = `Search Results`;
    modalSubtitle.innerText = `Matches for "${query}"`;

    // Fetch Results
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                modalText.innerHTML = `
                    <div style="text-align:center; padding: 30px;">
                        <p>No verses found containing "${query}".</p>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Try searching for words like "Soul", "Duty", "Yoga", or "Time".</p>
                    </div>`;
            } else {
                let versesHtml = `<p style="text-align:center; margin-bottom: 20px; color: var(--accent-primary);">${data.length} verses found</p>`;
                
                data.forEach(v => {
                    // PREPARE DATA FOR BUTTONS (Reuse existing logic)
                    const safeSanskrit = v.sanskrit ? v.sanskrit.replace(/"/g, '&quot;') : "";
                    const safeText = v.text.replace(/"/g, '&quot;');
                    const safeTransliteration = v.transliteration ? v.transliteration.replace(/"/g, '&quot;') : "";
                    const safeTitle = v.chapter_title.replace(/"/g, '&quot;'); // Search result has title now
                    
                    versesHtml += `
                        <div class="verse-item">
                            <span class="verse-number">Chapter ${v.chapter_number}, Verse ${v.verse}</span>
            
                            <div class="sanskrit-text">${v.sanskrit}</div>
                            <div class="transliteration-text">${v.transliteration}</div>
                            <p class="translation-text">${v.text}</p>
                            
                            <div class="action-bar">
                                <button class="action-btn" onclick="playAudio(this.getAttribute('data-text'))" data-text="${safeSanskrit}">
                                    🔊 Listen
                                </button>
                                
                                <button class="action-btn" onclick="copyVerse('${v.chapter_number}.${v.verse}', this.getAttribute('data-text'))" data-text="${safeText}">
                                    📋 Copy
                                </button>
                                
                                <button class="action-btn" onclick="triggerDownload(this)"
                                    data-chapter="${v.chapter_number}"
                                    data-title="${safeTitle}"
                                    data-verse="${v.verse}"
                                    data-sanskrit="${safeSanskrit}"
                                    data-transliteration="${safeTransliteration}"
                                    data-translation="${safeText}">
                                    📸 Download
                                </button>
                            </div>
                        </div>
                    `;
                });
                modalText.innerHTML = versesHtml;
            }
        })
        .catch(err => {
            console.error(err);
            modalText.innerHTML = "<p>Search failed. Please try again.</p>";
        });
}
