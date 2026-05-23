let stage = 0;
// 0 = start
// 1 = booting
// 2 = continue
// 3 = menu
// 4 = phase3

let bootState = "idle";
let inputLocked = false;

const clickSound = new Audio("click.mp3");
const rebootSound = new Audio("reboot.mp3");

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
   INIT
========================= */

window.addEventListener("load", () => {
    showScreen("startScreen");

    // make sure everything else is hidden
    document.querySelectorAll(".screen").forEach(s => {
        if (s.id !== "startScreen") s.classList.remove("active");
    });
});

/* =========================
   INPUT
========================= */

document.addEventListener("keydown", (e) => {
    if (inputLocked) return;
    if (e.key === "Enter") handleStart();
});

document.addEventListener("click", () => {
    if (inputLocked) return;
    handleStart();
});

/* =========================
   SOUND
========================= */

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.remove("active");
    });

    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}

/* =========================
   START FLOW
========================= */

function handleStart() {

    if (bootState === "booting") return;

    if (stage === 0) {

        bootState = "booting";
        playClick();

        showScreen("bootScreen");

        const bootAudio = document.getElementById("bootAudio");
        if (bootAudio) {
            bootAudio.currentTime = 0;
            bootAudio.play();
        }

        stage = 1;

        setTimeout(() => {
            showScreen("continueScreen");
            bootState = "continue";
        }, 8000);
    }

    else if (stage === 1 && bootState === "continue") {

        playClick();

        showScreen("menuScreen");

        stage = 3;
        bootState = "menu";
    }
}

/* =========================
   VIDEO CONTROL
========================= */

function stopVideoLog() {
    const video = document.getElementById("mainVideo");
    const container = document.getElementById("videoContainer");
    const button = document.getElementById("revealButton");

    if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.currentTime = 0;
        video.muted = true;
    }

    if (container) container.style.display = "none";
    if (button) button.style.display = "inline-block";
}

function revealVideo() {
    playClick();

    const video = document.getElementById("mainVideo");
    const container = document.getElementById("videoContainer");
    const button = document.getElementById("revealButton");

    if (!video) return;

    container.style.display = "block";
    button.style.display = "none";

    video.pause();
    video.currentTime = 0;

    video.src = "video1.mp4";
    video.muted = false;
    video.load();
}

/* =========================
   MENU SYSTEM
========================= */

function openTab(tabId) {

    playClick();
    stopVideoLog();

    document.querySelector(".menuGrid").style.display = "none";

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
    });

    const target = document.getElementById(tabId);
    if (target) target.classList.add("activeTab");

    if (tabId === "audioTab" && !sequencesLoaded) {
        loadSequences?.();
        sequencesLoaded = true;
    }

    if (tabId === "dnaTab" && !dnaLoaded) {
        loadDNASequences();
        dnaLoaded = true;
    }
}

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

    const labels = ["Sequence A", "Sequence B", "Sequence C", "Sequence D"];

    sequences.forEach((file, index) => {

        const block = document.createElement("div");
        block.className = "block collapsed";

        const button = document.createElement("button");
        button.className = "seqButton";

        const label = labels[index % labels.length];
        const baseName = file.replace(".html", "");

        button.textContent = `${baseName} — ${label}`;

        const content = document.createElement("div");
        content.className = "seqContent";

        const iframe = document.createElement("iframe");
        iframe.src = file;

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

    if (!success) return;

    document.getElementById("phase2Access").style.display = "block";

    /* =========================
       REBOOT SEQUENCE
    ========================= */

    rebootSound.currentTime = 0;
    rebootSound.play();

    showScreen("bootScreen");

    document.body.classList.add("glitch");

    setTimeout(() => {
        document.body.classList.remove("glitch");

        showScreen("phase3Screen");
        stage = 4;
        bootState = "phase3";

        const p3Audio = document.getElementById("phase3Audio");
        if (p3Audio) {
            p3Audio.currentTime = 0;
            p3Audio.play();
        }

    }, 2200);
}

/* =========================
   PHASE 3
========================= */

function openPhase3Tab(tabId) {

    playClick();

    document.querySelectorAll("#phase3Screen .tabContent")
        .forEach(t => t.classList.remove("activeTab"));

    const target = document.getElementById(tabId);
    if (target) target.classList.add("activeTab");
}

function closePhase3() {

    playClick();

    document.querySelectorAll("#phase3Screen .tabContent")
        .forEach(t => t.classList.remove("activeTab"));
}

function checkPhase3() {

    playClick();

    const input = document.getElementById("phase3Answer").value.trim();
    const result = document.getElementById("phase3Result");

    result.textContent = (input === "19")
        ? "SEQUENCE COMPLETE"
        : "INCORRECT";
}
