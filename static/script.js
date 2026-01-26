// 1. Staggered Entrance Animation on Load
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.chapter-card');
    cards.forEach((card, index) => {
        // Delay each card by 100ms * index (0ms, 100ms, 200ms...)
        card.style.animationDelay = `${index * 0.1}s`;
    });
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
                    versesHtml += `
                        <div class="verse-item" onclick="copyVerse(this, '${v.verse}')" title="Click to Copy">
                            <span class="verse-number">Verse ${v.verse}</span>
            
                            <div class="sanskrit-text">${v.sanskrit}</div>
            
                            <div class="transliteration-text">${v.transliteration}</div>
            
                            <p class="translation-text">${v.text}</p>
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

// 5. Dynamic "Click to Copy" Feature
function copyVerse(element, verseNum) {
    const text = element.querySelector('p').innerText;
    const fullText = `Bhagavad Gita Verse ${verseNum}: "${text}"`;

    navigator.clipboard.writeText(fullText).then(() => {
        showToast();
        
        // Visual feedback on the card itself
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = "rgba(255, 215, 0, 0.4)"; // Flash darker gold
        setTimeout(() => {
            element.style.backgroundColor = ""; // Revert
        }, 300);
    });
}

// 6. Toast Notification Logic
function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

// --- ORACLE FUNCTION ---
function askOracle() {
    const modal = document.getElementById("readingModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalText = document.getElementById("modalText");

    // Open Modal
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    // Loading State
    modalText.innerHTML = '<div style="text-align:center; padding: 50px; font-size: 1.5rem; color: var(--saffron);">Consulting the Divine...</div>';
    modalTitle.innerText = "Krishna Answers";
    modalSubtitle.innerText = "Reflect on this verse for your guidance";

    // Fetch Random Verse
    fetch('/api/oracle')
        .then(response => response.json())
        .then(data => {
            modalTitle.innerText = `Guidance from Chapter ${data.chapter_number}`;
            modalSubtitle.innerText = data.title;

            // Render the single large verse
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
                    <div style="margin-top: 30px; font-size: 0.9rem; color: #666;">
                        (Click the text to copy this message)
                    </div>
                </div>
            `;
            
            // Add click-to-copy to the whole container
            const container = modalText.querySelector('div');
            container.onclick = function() { 
                copyVerse(this, data.verse); 
            };
            container.style.cursor = "pointer";
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

    // Open Modal
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);

    // Initial Loading State
    modalText.innerHTML = '<div style="text-align:center; padding: 50px; font-size: 1.5rem; color: var(--saffron);">Finding comfort for your soul...</div>';
    modalTitle.innerText = "The Divine Remedy";
    modalSubtitle.innerText = `For when you are feeling ${emotion}`;

    // Fetch Mood Verse
    fetch(`/api/mood/${emotion}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                modalText.innerHTML = "<p>Peace be with you. Try again later.</p>";
            } else {
                modalTitle.innerText = `Chapter ${data.chapter_number}: ${data.title}`;
                
                // Render the Verse
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
                        
                        <div style="margin-top: 30px; font-size: 0.9rem; color: #666;">
                            (Click to copy this remedy)
                        </div>
                    </div>
                `;

                // Enable Click to Copy
                const container = modalText.querySelector('div');
                container.onclick = function() { 
                    copyVerse(this, data.verse); 
                };
                container.style.cursor = "pointer";
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
        localStorage.setItem("theme", "cosmic"); // Save preference
    } else {
        body.classList.remove("cosmic-mode");
        localStorage.setItem("theme", "day"); // Save preference
    }
}

// Check preference on load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const toggle = document.getElementById("cosmicToggle");

    if (savedTheme === "cosmic") {
        document.body.classList.add("cosmic-mode");
        if(toggle) toggle.checked = true;
    }
});

// --- COPY TO CLIPBOARD FUNCTION ---
function copyVerse(element, verseNum) {
    // 1. Get the text to copy
    // We try to find the text inside the clicked element
    let textToCopy = element.innerText;
    
    // 2. Copy to Clipboard API
    navigator.clipboard.writeText(textToCopy).then(() => {
        
        // 3. GET THE TOAST ELEMENT
        var toast = document.getElementById("toast");
        
        // 4. SHOW IT
        toast.className = "show";
        toast.innerText = "Verse Copied to Clipboard! 🕉";

        // 5. HIDE IT AFTER 3 SECONDS (The Fix)
        setTimeout(function(){ 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);
        
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
