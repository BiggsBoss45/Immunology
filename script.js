/* =========================
   GLOBAL STATE
========================= */

let stage = 0;
let bootState = "idle";
let started = false;
let locked = false;
let audioUnlocked = false;

/* =========================
   INIT (FIXED — SINGLE ENTRY POINT)
========================= */

window.addEventListener("DOMContentLoaded", () => {

    console.log("SCRIPT LOADED");

    // HARD RESET EVERYTHING (THIS FIXES YOUR MAIN ISSUE)
    stage = 0;
    bootState = "idle";
    started = false;
    locked = false;

    // hide ALL tabs
    document.querySelectorAll(".tabContent").forEach(t => {
        t.style.display = "none";
        t.classList.remove("activeTab");
    });

    // show ONLY start screen
    showScreen("startScreen");
});

/* =========================
   AUDIO
========================= */

const clickSound = new Audio("click.mp3");
const startupSound = new Audio("BootupIm.mp3");
const rebootSound = new Audio("reboot.mp3");

function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    clickSound.play().then(() => {
        clickSound.pause();
        clickSound.currentTime = 0;
    }).catch(() => {});
}

function playClick() {
    if (!audioUnlocked) return;
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}

function playStartup() {
    if (!audioUnlocked) return;
    startupSound.currentTime = 0;
    startupSound.play().catch(() => {});
}

/* =========================
   INPUT
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (locked) return;

    unlockAudio();
    handleStart();
});

document.addEventListener("click", () => {
    if (locked) return;
    unlockAudio();
});

/* =========================
   START HANDLER
========================= */

function handleStart() {
    if (locked) return;

    if (stage === 0) startSequence();
    else if (stage === 2 && bootState === "continue") continueToMenu();
}

/* =========================
   SCREEN SYSTEM (FIXED)
========================= */

function showScreen(id) {

    console.log("SCREEN:", id);

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
        screen.style.display = "none";
    });

    const target = document.getElementById(id);

    if (!target) {
        console.error("SCREEN NOT FOUND:", id);
        return;
    }

    target.classList.add("active");
    target.style.display = "flex";
}

/* =========================
   START SEQUENCE
========================= */

function startSequence() {

    if (started) return;

    started = true;
    locked = true;

    stage = 1;
    bootState = "booting";

    playStartup();
    showScreen("bootScreen");

    setTimeout(() => {

        stage = 2;
        bootState = "continue";
        locked = false;

        showScreen("continueScreen");

    }, 6000);
}

/* =========================
   MENU
========================= */

function continueToMenu() {

    stage = 3;
    bootState = "menu";

    playClick();
    showScreen("menuScreen");
}

/* =========================
   TAB SYSTEM
========================= */

function openTab(tabId) {

    playClick();

    // hide menu properly
    document.getElementById("menuScreen").style.display = "none";

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
        tab.style.display = "none";
    });

    const target = document.getElementById(tabId);

    if (target) {
        target.classList.add("activeTab");
        target.style.display = "block";
        target.style.position = "fixed";
        target.style.inset = "0";
        target.style.zIndex = "9999";
        target.style.background = "black";
    }
}

function closeTabs() {

    playClick();

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
        tab.style.display = "none";
    });

    showScreen("menuScreen");
}

/* =========================
   VIDEO
========================= */

function revealVideo() {

    playClick();

    const video = document.getElementById("mainVideo");
    const container = document.getElementById("videoContainer");
    const button = document.querySelector("#audioTab button");

    if (!video || !container || !button) return;

    container.style.display = "block";
    button.style.display = "none";

    video.play().catch(() => {});
}

/* =========================
   EXPORTS
========================= */

window.openTab = openTab;
window.closeTabs = closeTabs;
window.revealVideo = revealVideo;
