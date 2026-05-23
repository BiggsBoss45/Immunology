let stage = 0;

let bootState = "idle";
// idle → booting → continue → menu

const clickSound = new Audio("click.mp3");

/* =========================
   SEQUENCE DATA
========================= */

const sequences = [
    "B-01.html",
    "C-09.html",
    "E-13.html",
    "L-12.html",
    "M-22.html",
    "P-09.html",
    "S-05.html",
    "V-03.html",
    "H-07.html"
];

let sequencesLoaded = false;
let dnaLoaded = false;

/* =========================
   INPUT LISTENERS
========================= */

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

/* =========================
   CLICK SOUND
========================= */

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

/* =========================
   VIDEO CONTROL (HARD RESET)
========================= */

function stopVideoLog() {
    const video = document.getElementById("mainVideo");

    if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;

        // 🔥 HARD STOP AUTOPLAY RESUME BEHAVIOR
        video.removeAttribute("autoplay");
        video.load();
    }
}

/* =========================
   VIDEO REVEAL (SAFE PLAY ONLY)
========================= */

function revealVideo() {

    playClick();

    const video = document.getElementById("mainVideo");
    const container = document.getElementById("videoContainer");
    const button = document.getElementById("revealButton");

    if (video) {
        video.muted = false;

        // 🔥 ALWAYS RESET BEFORE PLAYING
        video.pause();
        video.currentTime = 0;

        video.src = "video1.mp4";

        video.load();

        // user-initiated play only
        video.play().catch(() => {});
    }

    if (container) {
        container.style.display = "block";
    }

    if (button) {
        button.style.display = "none";
    }
}

/* =========================
   START FLOW
========================= */

function handleStart() {

    if (bootState === "booting") return;

    if (stage === 0) {

        bootState = "booting";
        playClick();

        document.getElementById("startScreen")?.classList.remove("active");
        document.getElementById("bootScreen")?.classList.add("active");

        const bootAudio = document.getElementById("bootAudio");
        if (bootAudio) {
            bootAudio.currentTime = 0;
            bootAudio.play();
        }

        stage = 1;

        setTimeout(() => {
            document.getElementById("bootScreen")?.classList.remove("active");
            document.getElementById("continueScreen")?.classList.add("active");
            bootState = "continue";
        }, 8000);
    }

    else if (stage === 1 && bootState === "continue") {

        playClick();

        document.getElementById("continueScreen")?.classList.remove("active");
        document.getElementById("menuScreen")?.classList.add("active");

        stage = 2;
        bootState = "menu";
    }
}

/* =========================
   MENU SYSTEM
========================= */

function openTab(tabId) {

    playClick();

    // 🔥 IMPORTANT: always kill video state when switching tabs
    stopVideoLog();

    document.querySelector(".menuGrid").style.display = "none";

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
    });

    const target = document.getElementById(tabId);
    if (target) target.classList.add("activeTab");

    if (tabId === "audioTab" && !sequencesLoaded) {
        loadSequences();
        sequencesLoaded = true;
    }

    if (tabId === "dnaTab" && !dnaLoaded) {
        loadDNASequences();
        dnaLoaded = true;
    }
}

/* =========================
   CLOSE TABS
========================= */

function closeTabs() {

    playClick();
    stopVideoLog();

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
    });

    document.querySelector(".menuGrid").style.display = "flex";
}

/* =========================
   DNA SYSTEM
========================= */

function loadDNASequences() {

    const container = document.getElementById("dnaList");
    if (!container) return;

    container.innerHTML = "";

    const dnaFiles = [...sequences];

    const labels = ["Sequence A", "Sequence B", "Sequence C", "Sequence D"];

    dnaFiles.forEach((file, index) => {

        const block = document.createElement("div");
        block.className = "block collapsed";

        const button = document.createElement("button");
        button.className = "seqButton";

        const baseName = file.replace(".html", "");
        const label = labels[index % labels.length];

        button.textContent = `${baseName} — ${label}`;

        const content = document.createElement("div");
        content.className = "seqContent";

        const iframe = document.createElement("iframe");
        iframe.src = file;

        iframe.style.width = "100%";
        iframe.style.height = "350px";
        iframe.style.border = "1px solid white";

        content.appendChild(iframe);

        button.addEventListener("click", () => {

            const isOpen = content.classList.contains("active");

            document.querySelectorAll("#dnaList .seqContent")
                .forEach(c => c.classList.remove("active"));

            document.querySelectorAll("#dnaList .block")
                .forEach(b => {
                    b.classList.remove("expanded");
                    b.classList.add("collapsed");
                });

            if (!isOpen) {
                content.classList.add("active");
                block.classList.add("expanded");
                block.classList.remove("collapsed");
            }
        });

        block.appendChild(button);
        block.appendChild(content);
        container.appendChild(block);
    });
}

/* =========================
   PHASE 2
========================= */

function checkPhase2() {

    playClick();

    const selected = Array.from(
        document.querySelectorAll("#orgList input:checked")
    ).map(el => el.value);

    const correct = ["V-03", "E-13", "H-07", "P-09"];

    const success =
        selected.length === correct.length &&
        correct.every(code => selected.includes(code));

    const result = document.getElementById("phase2Result");

    if (result) {
        result.textContent = success
            ? "SEQUENCE VALIDATED"
            : "INVALID VECTOR COMBINATION";
    }

    if (success) {
        document.getElementById("phase2Access").style.display = "block";
        document.body.style.filter = "contrast(1.1) brightness(1.05)";
    }
}
