alert("SCRIPT IS RUNNING");
console.log("SCRIPT LOADED");

let stage = 0;
let bootState = "idle";
let started = false;
let locked = false;
let audioUnlocked = false;

/* =========================
   AUDIO SYSTEM
========================= */

const clickSound = new Audio("click.mp3");
const startupSound = new Audio("BootupIm.mp3");
const rebootSound = new Audio("reboot.mp3");

clickSound.preload = "auto";
startupSound.preload = "auto";
rebootSound.preload = "auto";

function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    clickSound.play()
        .then(() => {
            clickSound.pause();
            clickSound.currentTime = 0;
        })
        .catch(() => {});
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

function playReboot() {
    if (!audioUnlocked) return;
    rebootSound.currentTime = 0;
    rebootSound.play().catch(() => {});
}

/* =========================
   INIT
========================= */

window.addEventListener("load", () => {

    stage = 0;
    bootState = "idle";
    started = false;
    locked = false;

    showScreen("startScreen");
});

/* =========================
   INPUT (FIXED - NO AUTO SKIP BUG)
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
   SCREEN SYSTEM (CLEAN RESET)
========================= */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
        screen.style.display = "none";
    });

    const target = document.getElementById(id);

    if (target) {
        target.classList.add("active");
        target.style.display = "flex";
    }
}

/* =========================
   START SEQUENCE (LOCKED SAFE)
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
   TAB SYSTEM (FIXED OVERLAY BUGS)
========================= */

function openTab(tabId) {

    playClick();

    document.getElementById("menuScreen").style.display = "none";

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
        tab.style.display = "none";
        tab.style.position = "";
        tab.style.inset = "";
    });

    const target = document.getElementById(tabId);

    if (target) {

        target.classList.add("activeTab");
        target.style.display = "block";

        target.style.position = "fixed";
        target.style.inset = "0";
        target.style.zIndex = "9999";
        target.style.background = "black";
        target.style.overflowY = "auto";
    }

    /* ✅ FIX: ALWAYS reload DNA properly */
    if (tabId === "dnaTab") {
        loadDNA(true);
    }
}

function closeTabs() {

    playClick();

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
        tab.style.display = "none";
    });

    const menu = document.getElementById("menuScreen");
    if (menu) menu.style.display = "flex";
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
   DNA SYSTEM (FIXED VISIBILITY BUG)
========================= */

function loadDNA(force = false) {

    const dnaList = document.getElementById("dnaList");
    if (!dnaList) return;

    /* 🔥 FIX: allow reload */
    if (dnaList.childElementCount > 0 && !force) return;

    dnaList.innerHTML = "";

    const sequences = [
        "B-01","C-09","E-13","L-12",
        "M-22","P-09","S-05","V-03","H-07"
    ];

    sequences.forEach(seq => {

        const item = document.createElement("div");

        item.textContent = "DNA SEQUENCE: " + seq;

        item.style.padding = "14px";
        item.style.borderBottom = "1px solid #333";
        item.style.fontSize = "18px";
        item.style.color = "#7dffb0";

        dnaList.appendChild(item);
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
        correct.every(v => selected.includes(v));

    const result = document.getElementById("phase2Result");

    if (!result) return;

    result.textContent = success
        ? "SEQUENCE VALIDATED"
        : "INVALID COMBINATION";

    if (success) {
        document.getElementById("phase2Access").style.display = "block";
        setTimeout(() => enterPhase3(), 1000);
    }
}

/* =========================
   PHASE 3
========================= */

function enterPhase3() {

    stage = 4;

    showScreen("phase3Screen");

    const screen = document.getElementById("phase3Screen");

    if (!screen) return;

    screen.classList.add("zoomIn");

    setTimeout(() => screen.classList.remove("zoomIn"), 1200);
}

/* =========================
   PHASE 3 TAB SYSTEM
========================= */

function openPhase3Tab(tabId) {

    playClick();

    const menuGrid = document.querySelector("#phase3Screen .menuGrid");
    if (menuGrid) menuGrid.style.display = "none";

    document.querySelectorAll("#phase3Screen .tabContent")
        .forEach(tab => {
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
        target.style.overflowY = "auto";
    }
}

function closePhase3() {

    playClick();

    document.querySelectorAll("#phase3Screen .tabContent")
        .forEach(tab => {
            tab.classList.remove("activeTab");
            tab.style.display = "none";
        });

    const menuGrid = document.querySelector("#phase3Screen .menuGrid");
    if (menuGrid) menuGrid.style.display = "flex";
}

/* =========================
   SIMULATION CORE (UNCHANGED - WORKING)
========================= */

function runSimulation() {

    playClick();

    const bacteria = document.getElementById("bacteriaCell");
    const virus = document.getElementById("virusParticle");
    const rna = document.getElementById("rnaStrand");
    const result = document.getElementById("simulationResult");
    const atpBar = document.getElementById("atpBarInner");
    const atpValue = document.getElementById("atpValue");

    if (!bacteria || !virus || !result || !atpBar || !atpValue) return;

    const pathway = document.getElementById("pathwaySelect")?.value;
    const atpState = document.getElementById("atpSelect")?.value;
    const mutation = document.getElementById("mutationSelect")?.value;

bacteria.classList.remove(
    "deadCell",
    "lysing",
    "stableCell",
    "mutatedCell",
    "failedMutation"
);

virus.classList.remove(
    "injecting",
    "grabbing",
    "attached"
);
   
    if (rna) rna.className = "";

    result.textContent = "Injecting viral RNA...";
    atpBar.style.width = "0%";
    atpValue.textContent = "0 ATP";

    if (rna) rna.classList.add("rnaInject");

   setTimeout(() => {

    virus.classList.remove("injecting","grabbing","attached");
    void virus.offsetWidth; // 🔥 forces redraw

    virus.classList.add("injecting");

}, 200);

setTimeout(() => {
    virus.classList.add("grabbing");
}, 900);

setTimeout(() => {
    virus.classList.add("attached");
}, 1400);
/* =========================
   EXPORTS
========================= */

window.openTab = openTab;
window.closeTabs = closeTabs;
window.revealVideo = revealVideo;
window.checkPhase2 = checkPhase2;
window.runSimulation = runSimulation;
window.openPhase3Tab = openPhase3Tab;
window.closePhase3 = closePhase3;
window.enterPhase3 = enterPhase3;
