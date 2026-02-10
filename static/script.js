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

/* =========================================
   🌌 COSMIC GYROSCOPE LOGIC
   ========================================= */
const body = document.body;
let mouseX = 0, mouseY = 0;
let gyroX = 0, gyroY = 0;

// 1. DESKTOP PARALLAX (Mouse Move)
document.addEventListener("mousemove", (e) => {
    if (!body.classList.contains("cosmic-mode")) return;
    
    // Normalize coordinates from center of screen (-1 to +1)
    mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    
    // Update CSS variables for smooth movement
    updateCosmicPosition(mouseX * 20, mouseY * 20); // 20px max movement
});

// 2. MOBILE PARALLAX (Gyroscope)
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
        if (!body.classList.contains("cosmic-mode")) return;
        
        // Beta: Front/Back tilt (-180 to 180). Gamma: Left/Right tilt (-90 to 90)
        let tiltX = e.gamma || 0; 
        let tiltY = e.beta || 0;
        
        // Limit range to prevent extreme scrolling
        tiltX = Math.max(-45, Math.min(45, tiltX));
        tiltY = Math.max(-45, Math.min(45, tiltY));

        // Update CSS variables
        updateCosmicPosition(tiltX, tiltY); 
    });
}

// 3. Update Function
function updateCosmicPosition(x, y) {
    // We use requestAnimationFrame for performance
    requestAnimationFrame(() => {
        body.style.setProperty('--move-x', `${x}px`);
        body.style.setProperty('--move-y', `${y}px`);
    });
}


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
    // Stop visualizer when closing
    const visualizer = document.getElementById('globalVisualizer');
    if(visualizer) visualizer.classList.remove('active');

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

/* =========================================
   🔮 MYSTIC CARD LOGIC
   ========================================= */

// 1. Open the Card Deck
function askOracle() {
    const overlay = document.getElementById('cardDeckOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    document.querySelectorAll('.mystic-card').forEach(card => {
        card.classList.remove('flipped');
    });
}

// 2. Close the Deck
function closeCardDeck() {
    const overlay = document.getElementById('cardDeckOverlay');
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

// 3. Reveal a Card
function revealCard(cardElement) {
    if (cardElement.classList.contains('flipped')) return;

    cardElement.classList.add('flipped');

    setTimeout(() => {
        fetchOracleVerse();
        closeCardDeck();
    }, 1000);
}

// 4. Fetch the Verse
function fetchOracleVerse() {
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
    
    modalText.innerHTML = '<div style="text-align:center; padding: 50px;">Consulting the stars...</div>';

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
                <div class="verse-item" style="border:none;">
                    <span class="verse-number">Verse ${data.verse}</span>
                    <div class="sanskrit-text">${data.sanskrit || ''}</div>
                    <div class="transliteration-text">${data.transliteration || ''}</div>
                    <p class="translation-text" style="text-align:center; font-size: 1.3rem;">${data.text}</p>
                    
                    <div class="action-bar">
                         <button class="action-btn" onclick="playAudio(this.getAttribute('data-text'))" data-text="${safeSanskrit}">
                            🔊 Listen
                        </button>
                        <button class="action-btn" onclick="copyVerse('${data.chapter_number}.${data.verse}', this.getAttribute('data-text'))" data-text="${safeText}">
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
        .catch(error => {
            console.error('Error:', error);
            modalText.innerHTML = "<p>The connection to the divine is faint... try again.</p>";
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
   🗣️ VANI (DIVINE AUDIO ENGINE) - FIXED
   ========================================= */
let audioContext;
let currentSource;

function playAudio(text) {
    const visualizer = document.getElementById('globalVisualizer');
    
    // --- 🛠️ AUDIO CLEANING FIX ---
    // 1. Remove text between double bars (||...||) e.g., ||16-21||
    // 2. Remove any remaining single bars
    // 3. Remove digits
    let cleanText = text.replace(/\|\|.*?\|\|/g, "") 
                        .replace(/\|/g, " ")
                        .replace(/[0-9]/g, "")
                        .trim();

    if(visualizer) visualizer.classList.add('active');
    
    fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText })
    })
    .then(response => response.json())
    .then(async data => {
        if (data.error) {
            console.error("TTS Error:", data.error);
            showToast("Krishna's voice is faint...");
            if(visualizer) visualizer.classList.remove('active');
            return;
        }

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (currentSource) { try { currentSource.stop(); } catch(e){} }

        const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
        const audioBuffer = await audioContext.decodeAudioData(audioBytes.buffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // PITCH DROP
        source.playbackRate.value = 0.85; 

        const convolver = audioContext.createConvolver();
        const rate = audioContext.sampleRate;
        const length = rate * 1.5; 
        const impulse = audioContext.createBuffer(2, length, rate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const decay = Math.pow(1 - i / length, 2); 
            impulseL[i] = (Math.random() * 2 - 1) * decay;
            impulseR[i] = (Math.random() * 2 - 1) * decay;
        }
        convolver.buffer = impulse;

        const dryNode = audioContext.createGain();
        const wetNode = audioContext.createGain();
        
        dryNode.gain.value = 0.8; 
        wetNode.gain.value = 0.3; 

        source.connect(dryNode);
        source.connect(convolver);
        convolver.connect(wetNode);
        
        dryNode.connect(audioContext.destination);
        wetNode.connect(audioContext.destination);

        source.start(0);
        currentSource = source;

        source.onended = () => {
            if(visualizer) visualizer.classList.remove('active');
        };
    })
    .catch(err => {
        console.error("Audio Engine Error:", err);
        if(visualizer) visualizer.classList.remove('active');
    });
}

/* =========================================
   📸 DOWNLOAD IMAGE FEATURE
   ========================================= */
function triggerDownload(btn) {
    const chapNum = btn.getAttribute('data-chapter');
    const chapTitle = btn.getAttribute('data-title');
    const verseNum = btn.getAttribute('data-verse');
    const sanskrit = btn.getAttribute('data-sanskrit');
    const transliteration = btn.getAttribute('data-transliteration');
    const translation = btn.getAttribute('data-translation');
    
    downloadVerseImage(chapNum, chapTitle, verseNum, sanskrit, transliteration, translation);
}

function downloadVerseImage(chapNum, chapTitle, verseNum, sanskrit, transliteration, translation) {
    showToast("Generating Image... 🎨");

    document.getElementById('print-chapter-info').innerText = `Chapter ${chapNum}: ${chapTitle}`;
    document.getElementById('print-verse-num').innerText = `Verse ${verseNum}`;
    document.getElementById('print-sanskrit').innerText = sanskrit || "";
    document.getElementById('print-transliteration').innerText = transliteration || "";
    document.getElementById('print-translation').innerText = `"${translation}"`;

    const container = document.getElementById('printable-card-container');

    html2canvas(container, {
        useCORS: true, 
        scale: 2,       
        backgroundColor: null 
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
function handleEnter(event) {
    if (event.key === "Enter") {
        performSearch();
    }
}

function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    modalText.innerHTML = '<div style="text-align:center; padding: 50px; color: var(--saffron);">Searching...</div>';
    modalTitle.innerText = `Search Results`;
    modalSubtitle.innerText = `Matches for "${query}"`;

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                modalText.innerHTML = `
                    <div style="text-align:center; padding: 30px;">
                        <p>No verses found containing "${query}".</p>
                    </div>`;
            } else {
                let versesHtml = `<p style="text-align:center; margin-bottom: 20px;">${data.length} verses found</p>`;
                
                data.forEach(v => {
                    const safeSanskrit = v.sanskrit ? v.sanskrit.replace(/"/g, '&quot;') : "";
                    const safeText = v.text.replace(/"/g, '&quot;');
                    const safeTransliteration = v.transliteration ? v.transliteration.replace(/"/g, '&quot;') : "";
                    const safeTitle = v.chapter_title.replace(/"/g, '&quot;'); 
                    
                    versesHtml += `
                        <div class="verse-item">
                            <span class="verse-number">Chapter ${v.chapter_number}, Verse ${v.verse}</span>
            
                            <div class="sanskrit-text">${v.sanskrit}</div>
                            <div class="transliteration-text">${v.transliteration}</div>
                            <p class="translation-text">${v.text}</p>
                            
                            <div class="action-bar">
                                <button class="action-btn" onclick="playAudio(this.getAttribute('data-text'))" data-text="${safeSanskrit}">🔊 Listen</button>
                                <button class="action-btn" onclick="copyVerse('${v.chapter_number}.${v.verse}', this.getAttribute('data-text'))" data-text="${safeText}">📋 Copy</button>
                                <button class="action-btn" onclick="triggerDownload(this)"
                                    data-chapter="${v.chapter_number}"
                                    data-title="${safeTitle}"
                                    data-verse="${v.verse}"
                                    data-sanskrit="${safeSanskrit}"
                                    data-transliteration="${safeTransliteration}"
                                    data-translation="${safeText}">📸 Download</button>
                            </div>
                        </div>
                    `;
                });
                modalText.innerHTML = versesHtml;
            }
        });
}

/* =========================================
   🤖 KRISHNA CHATBOT LOGIC (TEXT ONLY + RESIZABLE)
   ========================================= */
const chatContainer = document.getElementById("chatbotContainer");
const resizer = document.getElementById("chatResizer");

function openChat() {
    chatContainer.style.display = "flex";
    setTimeout(() => {
        chatContainer.classList.add("active");
    }, 10);
    document.getElementById("chatInput").focus();
}

function closeChat() {
    chatContainer.classList.remove("active");
    setTimeout(() => {
        chatContainer.style.display = "none";
    }, 400); 
}

// RESIZING LOGIC
let isResizing = false;
let startY, startHeight;

resizer.addEventListener('mousedown', initResize);
document.addEventListener('mousemove', resize);
document.addEventListener('mouseup', stopResize);

resizer.addEventListener('touchstart', initResize, { passive: false });
document.addEventListener('touchmove', resize, { passive: false });
document.addEventListener('touchend', stopResize);

function initResize(e) {
    isResizing = true;
    startY = e.clientY || e.touches[0].clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(chatContainer).height, 10);
    document.body.style.userSelect = 'none';
    if(e.type === 'touchstart') e.preventDefault();
}

function resize(e) {
    if (!isResizing) return;
    if(e.type === 'touchmove') e.preventDefault();
    
    const clientY = e.clientY || e.touches[0].clientY;
    const deltaY = startY - clientY;
    let newHeight = startHeight + deltaY;

    const windowHeight = window.innerHeight;
    const navbarHeight = 80; 
    const minHeight = 200;   
    const maxHeight = windowHeight - navbarHeight;

    if (newHeight > maxHeight) newHeight = maxHeight;
    if (newHeight < minHeight) newHeight = minHeight;

    chatContainer.style.height = `${newHeight}px`;
}

function stopResize() {
    isResizing = false;
    document.body.style.userSelect = 'auto';
}

function handleChatEnter(event) {
    if (event.key === "Enter") sendMessage();
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;

    addChatMessage(message, "user-message");
    input.value = "";

    const typingId = "typing-" + Date.now();
    addChatMessage('<span class="typing-dots">Krishna is contemplating</span>', "bot-message", typingId, true);

    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        if (data.reply) {
            const formattedReply = data.reply.replace(/\n/g, "<br>");
            addChatMessage(formattedReply, "bot-message", null, true);
        } else {
            addChatMessage("I am always here, but I did not understand that fully.", "bot-message");
        }
    })
    .catch(err => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        addChatMessage("The connection is faint. Try again.", "bot-message");
    });
}

function addChatMessage(text, className, id = null, isHTML = false) {
    const chatBody = document.getElementById("chatBody");
    const div = document.createElement("div");
    div.className = `chat-message ${className}`;
    if (id) div.id = id;
    
    if (isHTML) {
        div.innerHTML = text;
    } else {
        div.innerText = text;
    }
    
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
