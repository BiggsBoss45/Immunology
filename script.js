let stage = 0;
// 0 = start
// 1 = booting
// 2 = continue
// 3 = menu
// 4 = phase3

let bootState = "idle";
let started = false;

const clickSound = new Audio("click.mp3");
const rebootSound = new Audio("reboot.mp3");
rebootSound.preload = "auto";

/* =========================
   DATA
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
   INIT (FORCE CLEAN START)
========================= */

window.addEventListener("load", () => {

    stage = 0;
    bootState = "idle";
    started = false;

    showScreen("startScreen");

    document.querySelector(".menuGrid")?.style && 
        (document.querySelector(".menuGrid").style.display = "flex");
});

/* =========================
   INPUT (ONLY START FLOW)
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startSequence();
});

document.addEventListener("click", () => {
    startSequence();
});

/* =========================
   SOUND
========================= */

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
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
   START SEQUENCE
========================= */

function startSequence() {

    if (started) return;
    started = true;

    stage = 1;
    bootState = "booting";

    playClick();
    showScreen("bootScreen");

    const bootAudio = document.getElementById("bootAudio");
    if (bootAudio) {
        bootAudio.currentTime = 0;
        bootAudio.play().catch(() => {});
    }

    setTimeout(() => {
        showScreen("continueScreen");
        stage = 2;
        bootState = "continue";
    }, 8000);
}

/* =========================
   CONTINUE → MENU
========================= */

document.addEventListener("click", () => {

    if (stage !== 2 || bootState !== "continue") return;

    playClick();

    stage = 3;
    bootState = "menu";

    showScreen("menuScreen");
});

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
   VIDEO
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

    video.src = "video1.mp4";
    video.muted = false;
    video.load();
}

/* =========================
   PHASE 2 → REBOOT → PHASE 3 (FIXED SYNC)
========================= */

function checkPhase2() {

    playClick();

    const selected = Array.from(
        document.querySelectorAll("#orgList input:checked")
    ).map(el => el.value);

    const correct = ["V-03", "E-13", "H-07", "P-09"];

    const success =
        selected.length === correct.length &&
        correct.every(v => selected.includes(v));

    const result = document.getElementById("phase2Result");

    if (result) {
        result.textContent = success
            ? "SEQUENCE VALIDATED"
            : "INVALID VECTOR COMBINATION";
    }

    if (!success) return;

    document.getElementById("phase2Access").style.display = "block";

    // =========================
    // REBOOT SEQUENCE (SYNC FIX)
    // =========================

    stage = 4;
    bootState = "phase3";

    showScreen("bootScreen");

    document.body.classList.add("glitch");

    // RESET AUDIO + PLAY FULL REBOOT SOUND
    rebootSound.pause();
    rebootSound.currentTime = 0;

    const playPromise = rebootSound.play();
    if (playPromise) {
        playPromise.catch(() => {});
    }

    // keep screen locked during reboot
    const menuGrid = document.querySelector(".menuGrid");
    if (menuGrid) menuGrid.style.display = "none";

    setTimeout(() => {

        document.body.classList.remove("glitch");

        showScreen("phase3Screen");

        const p3Audio = document.getElementById("phase3Audio");
        if (p3Audio) {
            p3Audio.currentTime = 0;
            p3Audio.play().catch(() => {});
        }

    }, 7000); // 🔥 MATCHES reboot.mp3 LENGTH
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

    result.textContent =
        (input === "19") ? "SEQUENCE COMPLETE" : "INCORRECT";
}
