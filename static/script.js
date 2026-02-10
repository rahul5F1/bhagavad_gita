/* =========================================
   1. GLOBAL VARIABLES & INIT
   ========================================= */
let audioContext = null;
let currentSource = null; // Tracks the currently playing speech

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

// 1. DESKTOP PARALLAX (Mouse Move)
document.addEventListener("mousemove", (e) => {
    if (!body.classList.contains("cosmic-mode")) return;
    mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    updateCosmicPosition(mouseX * 20, mouseY * 20); 
});

// 2. MOBILE PARALLAX (Gyroscope)
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
        if (!body.classList.contains("cosmic-mode")) return;
        let tiltX = e.gamma || 0; 
        let tiltY = e.beta || 0;
        tiltX = Math.max(-45, Math.min(45, tiltX));
        tiltY = Math.max(-45, Math.min(45, tiltY));
        updateCosmicPosition(tiltX, tiltY); 
    });
}

function updateCosmicPosition(x, y) {
    requestAnimationFrame(() => {
        body.style.setProperty('--move-x', `${x}px`);
        body.style.setProperty('--move-y', `${y}px`);
    });
}

/* =========================================
   2. CHAPTER MODAL LOGIC
   ========================================= */
function openChapter(chapterNum) {
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    modalText.innerHTML = '<div style="text-align:center; padding: 50px; color: var(--accent-secondary);">Loading Divine Verses...</div>';

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
                                    data-title="${data.title.replace(/"/g, '&quot;')}"
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

// --- FIX: STOP AUDIO ON CLOSE ---
function closeChapter() {
    const modal = document.getElementById("readingModal");
    
    // 1. Force Stop Audio if playing
    if (currentSource) {
        try {
            currentSource.stop();
        } catch(e) {
            // Ignore error if already stopped
        }
        currentSource = null;
    }

    // 2. Turn off Visualizer
    const visualizer = document.getElementById('globalVisualizer');
    if(visualizer) visualizer.classList.remove('active');

    // 3. Hide Modal
    modal.classList.remove("show");
    setTimeout(() => { modal.style.display = "none"; }, 400);
}

// Close on Click Outside
window.onclick = function(event) {
    const modal = document.getElementById("readingModal");
    if (event.target == modal) {
        closeChapter();
    }
}

/* =========================================
   🔮 MYSTIC CARD LOGIC
   ========================================= */
function askOracle() {
    const overlay = document.getElementById('cardDeckOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.classList.add('show'); }, 10);
    document.querySelectorAll('.mystic-card').forEach(card => {
        card.classList.remove('flipped');
    });
}

function closeCardDeck() {
    const overlay = document.getElementById('cardDeckOverlay');
    overlay.classList.remove('show');
    setTimeout(() => { overlay.style.display = 'none'; }, 500);
}

function revealCard(cardElement) {
    if (cardElement.classList.contains('flipped')) return;
    cardElement.classList.add('flipped');
    setTimeout(() => {
        fetchOracleVerse();
        closeCardDeck();
    }, 1000);
}

function fetchOracleVerse() {
    openChapterModalForSingleVerse('/api/oracle', "Consulting the stars...");
}

function askMood(emotion) {
    openChapterModalForSingleVerse(`/api/mood/${emotion}`, "Finding comfort for your soul...");
}

// Helper to reuse modal logic for single verse results (Oracle/Mood)
function openChapterModalForSingleVerse(apiUrl, loadingMsg) {
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
    modalText.innerHTML = `<div style="text-align:center; padding: 50px;">${loadingMsg}</div>`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                modalText.innerHTML = "<p>The connection is faint...</p>";
                return;
            }
            modalTitle.innerText = `Guidance from Chapter ${data.chapter_number}`;
            modalSubtitle.innerText = data.title || "Divine Wisdom";
            
            const safeSanskrit = data.sanskrit ? data.sanskrit.replace(/"/g, '&quot;') : "";
            const safeText = data.text.replace(/"/g, '&quot;');
            
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
                            data-title="${data.title}"
                            data-verse="${data.verse}"
                            data-sanskrit="${safeSanskrit}"
                            data-transliteration="${data.transliteration || ''}"
                            data-translation="${safeText}">
                            📸 Download
                        </button>
                    </div>
                </div>
            `;
        })
        .catch(err => modalText.innerHTML = "<p>Error connecting.</p>");
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
   3. 🗣️ VANI (AUDIO ENGINE) - FIXED (Visualizer + Stop Logic + Effects)
   ========================================= */
function playAudio(text) {
    const visualizer = document.getElementById('globalVisualizer');
    
    // Clean text (Remove pipes || and numbers for better speech)
    let cleanText = text.replace(/\|\|.*?\|\|/g, "") 
                        .replace(/\|/g, " ")
                        .replace(/[0-9]/g, "")
                        .trim();

    // 1. Activate Visualizer Immediately
    if(visualizer) visualizer.classList.add('active');
    
    // 2. Fetch Audio
    fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText })
    })
    .then(response => response.json())
    .then(async data => {
        if (data.error) {
            showToast("Krishna's voice is faint...");
            if(visualizer) visualizer.classList.remove('active');
            return;
        }

        // Initialize Audio Context if needed
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Stop any currently playing audio
        if (currentSource) {
            try { currentSource.stop(); } catch(e){}
        }

        // Decode & Play
        const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
        const audioBuffer = await audioContext.decodeAudioData(audioBytes.buffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        // --- RESTORED EFFECTS (Speed & Reverb) ---
        // 1. Slow down for divine effect
        source.playbackRate.value = 0.85; 

        // 2. Create Reverb Effect
        const convolver = audioContext.createConvolver();
        const rate = audioContext.sampleRate;
        const length = rate * 1.5; // 1.5 seconds of reverb tail
        const impulse = audioContext.createBuffer(2, length, rate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const decay = Math.pow(1 - i / length, 2); 
            impulseL[i] = (Math.random() * 2 - 1) * decay;
            impulseR[i] = (Math.random() * 2 - 1) * decay;
        }
        convolver.buffer = impulse;

        // 3. Audio Graph: Source -> (Dry + Wet) -> Destination
        const dryNode = audioContext.createGain();
        const wetNode = audioContext.createGain();
        
        dryNode.gain.value = 0.8; // Original Sound
        wetNode.gain.value = 0.3; // Reverb Volume

        source.connect(dryNode);
        source.connect(convolver);
        convolver.connect(wetNode);
        
        dryNode.connect(audioContext.destination);
        wetNode.connect(audioContext.destination);

        // Start Playback
        source.start(0);
        currentSource = source; // Save reference so we can stop it on close

        // Deactivate Visualizer when audio ends
        source.onended = () => {
            if(visualizer) visualizer.classList.remove('active');
            currentSource = null;
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
    downloadVerseImage(
        btn.getAttribute('data-chapter'),
        btn.getAttribute('data-title'),
        btn.getAttribute('data-verse'),
        btn.getAttribute('data-sanskrit'),
        btn.getAttribute('data-transliteration'),
        btn.getAttribute('data-translation')
    );
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
    if (event.key === "Enter") performSearch();
}

function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    
    // Reuse the Oracle logic to display search results in the modal for now
    const modal = document.getElementById("readingModal");
    const modalText = document.getElementById("modalText");
    const modalTitle = document.getElementById("modalTitle");
    
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
    modalTitle.innerText = "Search Results";
    document.getElementById("modalSubtitle").innerText = `Query: "${query}"`;
    modalText.innerHTML = '<div style="text-align:center;">Searching scriptures...</div>';

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
        if(data.length === 0) {
            modalText.innerHTML = "<p style='text-align:center'>No verses found.</p>";
        } else {
            let html = "";
            data.forEach(v => {
                html += `
                <div class="verse-item">
                    <span class="verse-number">Chapter ${v.chapter_number}, Verse ${v.verse}</span>
                    <div class="sanskrit-text">${v.sanskrit}</div>
                    <p class="translation-text">${v.text}</p>
                    <div class="action-bar">
                        <button class="action-btn" onclick="playAudio('${v.sanskrit.replace(/'/g,"")}')">🔊 Listen</button>
                    </div>
                </div>`;
            });
            modalText.innerHTML = html;
        }
    });
}

/* =========================================
   🤖 KRISHNA CHATBOT LOGIC
   ========================================= */
const chatContainer = document.getElementById("chatbotContainer");
const resizer = document.getElementById("chatResizer");

function openChat() {
    chatContainer.style.display = "flex";
    setTimeout(() => { chatContainer.classList.add("active"); }, 10);
    document.getElementById("chatInput").focus();
}

function closeChat() {
    chatContainer.classList.remove("active");
    setTimeout(() => { chatContainer.style.display = "none"; }, 400); 
}

// RESIZING LOGIC
let isResizing = false;
let startY, startHeight;

if(resizer){
    resizer.addEventListener('mousedown', initResize);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);

    resizer.addEventListener('touchstart', initResize, { passive: false });
    document.addEventListener('touchmove', resize, { passive: false });
    document.addEventListener('touchend', stopResize);
}

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
    const maxHeight = windowHeight - 80;
    const minHeight = 200;

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
