/* =========================
   GLOBAL STATE
========================= */

let stage = 0;
let bootState = "idle";
let started = false;
let locked = false;
let audioUnlocked = false;

/* =========================
   DATA
========================= */

const recoveredSequences = [
    "ATGCGTACCTGAACTGACCTGA",
    "TTGACCGTAGGCTAACCGTAAA",
    "CGTAGCTAGGATCCGTAGCTAA",
    "GGATCCGTAACCGTAGGCTTAC",
    "ATCGGATCGTAGCTAACCGATA",
    "TTAACCGGATCGTAGCTAGCTA",
    "CCGTAATCGGATCGTAGCTAAC",
    "GATCGTAGCTAATCGGATCCGA",
    "AACCGTAGCTAGGATCGTACCA"
];

const correctProtein =
    "MET-VAL-LYS-ARG-THR-GLY-SER-PRO-LEU";

/* =========================
   INIT
========================= */

window.addEventListener("DOMContentLoaded", () => {

    console.log("SCRIPT LOADED");

    stage = 0;
    bootState = "idle";
    started = false;
    locked = false;

    document.querySelectorAll(".tabContent").forEach(t => {
        t.style.display = "none";
        t.classList.remove("activeTab");
    });

    generateRecoveredDNA();
    generateProteinSequence();

    showScreen("startScreen");
});

/* =========================
   AUDIO (SAFE MOBILE VERSION)
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
   START (FIXED FOR MOBILE)
========================= */

function handleStart() {

    if (locked) return;

    // FIRST TAP / START
    if (stage === 0) {
        startSequence();
        return;
    }

    // CONTINUE SCREEN
    if (stage === 2 && bootState === "continue") {
        continueToMenu();
    }
}

/* =========================
   OPTIONAL KEY SUPPORT
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    unlockAudio();
    handleStart();
});

/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id) {

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

    unlockAudio();
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
   CONTINUE
========================= */

function continueToMenu() {

    stage = 3;
    bootState = "menu";

    playClick();
    showScreen("menuScreen");
}

/* =========================
   MOBILE SAFE TAP START
   (THIS IS THE KEY FIX)
========================= */

document.getElementById("startScreen")
?.addEventListener("click", () => {
    unlockAudio();
    handleStart();
});

/* =========================
   TAB SYSTEM
========================= */

function openTab(tabId) {

    playClick();

    document.getElementById("menuScreen").style.display = "none";

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
        tab.style.display = "none";
    });

    const target = document.getElementById(tabId);

    if (!target) {
        console.error("TAB NOT FOUND:", tabId);
        return;
    }

    target.classList.add("activeTab");
    target.style.display = "block";
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

    if (!video || !container) return;

    container.style.display = "block";
    video.play().catch(() => {});
}

/* =========================
   DNA GENERATION
========================= */

function generateRecoveredDNA() {

    const container = document.getElementById("dnaList");

    if (!container) return;

    container.innerHTML = "";

    recoveredSequences.forEach((seq, i) => {

        const div = document.createElement("div");

        div.innerHTML = `
            <strong>SAMPLE ${i + 1}</strong><br><br>
            ${seq}
        `;

        container.appendChild(div);
    });
}

/* =========================
   PROTEIN DISPLAY
========================= */

function generateProteinSequence() {

    const container = document.getElementById("proteinSequence");
    if (!container) {
    console.error("DNA LIST MISSING: #dnaList not found in HTML");
    return;
}

    container.innerHTML = "";

    correctProtein.split("-").forEach(codon => {

        const span = document.createElement("span");
        span.className = "codon";
        span.textContent = codon;

        container.appendChild(span);
    });
}

/* =========================
   VALIDATION
========================= */

function validateSequence() {

    playClick();

    const input = document
        .getElementById("sequenceInput")
        ?.value
        ?.trim()
        ?.toUpperCase();

    const output = document.getElementById("validationOutput");

    if (!output) return;

    if (input === correctProtein) {

        output.innerHTML =
            `<span style="color:#4cff88">ACCESS GRANTED</span>`;

    } else {

        output.innerHTML =
            `<span style="color:#ff5577">INVALID SEQUENCE</span>`;
    }
}

/* =========================
   SIMULATION
========================= */

function runInfection() {

    const virus = document.getElementById("virusParticle");
    const cell = document.getElementById("bacteriaCell");

    if (!virus || !cell) return;

    virus.style.animation = "none";
    virus.className = "";
    void virus.offsetWidth;

    virus.classList.add("injecting");

    setTimeout(() => virus.classList.add("grabbing"), 2200);
    setTimeout(() => virus.classList.add("attached"), 2800);

    setTimeout(() => {

        const rna = document.createElement("div");
        rna.className = "rnaInject";
        virus.appendChild(rna);

        cell.classList.add("infectedPulse");

    }, 3400);

    setTimeout(() => cell.classList.add("deadCell"), 5200);
    setTimeout(() => cell.classList.add("lysing"), 6700);
}

/* =========================
   EXPORTS
========================= */

window.openTab = openTab;
window.closeTabs = closeTabs;
window.revealVideo = revealVideo;
window.validateSequence = validateSequence;
window.runInfection = runInfection;
window.handleStart = handleStart;
