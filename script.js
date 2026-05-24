/* =========================
   GLOBAL STATE
========================= */

let stage = 0;
let bootState = "idle";
let started = false;
let locked = false;
let audioUnlocked = false;

/* =========================
   SEQUENCE DATA
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

    if (stage === 0) {
        startSequence();
    }

    else if (stage === 2 && bootState === "continue") {
        continueToMenu();
    }
}

/* =========================
   SCREEN SYSTEM
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
    target.style.position = "fixed";
    target.style.inset = "0";
    target.style.zIndex = "9999";
    target.style.background = "black";
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
   RECOVERED DNA
========================= */

function generateRecoveredDNA() {

    const container = document.getElementById("recoveredContainer");

    if (!container) return;

    container.innerHTML = "";

    recoveredSequences.forEach((seq, i) => {

        const div = document.createElement("div");

        div.className = "recoveredFile";

        div.innerHTML = `
            <strong>RECOVERED SAMPLE ${i + 1}</strong>
            <br><br>
            ${seq}
        `;

        container.appendChild(div);
    });
}

/* =========================
   AMINO ACID DISPLAY
========================= */

function generateProteinSequence() {

    const protein = document.getElementById("proteinSequence");

    if (!protein) return;

    protein.innerHTML = correctProtein;
}

/* =========================
   PHASE 2 VALIDATION
========================= */

function validateSequence() {

    playClick();

    const input = document
        .getElementById("sequenceInput")
        .value
        .trim()
        .toUpperCase();

    const output = document.getElementById("validationOutput");

    if (!output) return;

    if (input === correctProtein) {

        output.innerHTML = `
            <span style="color:#4cff88">
                ACCESS GRANTED
            </span>
        `;

        unlockPhase3();
    }

    else {

        output.innerHTML = `
            <span style="color:#ff5577">
                INVALID SEQUENCE
            </span>
        `;
    }
}

/* =========================
   PHASE 3 UNLOCK
========================= */

function unlockPhase3() {

    const phase3 = document.getElementById("phase3Button");

    if (!phase3) return;

    phase3.style.display = "inline-block";

    phase3.style.opacity = "1";

    phase3.style.pointerEvents = "auto";
}

/* =========================
   VIRUS SIMULATION
========================= */

function runInfection() {

    const virus = document.getElementById("virusParticle");
    const cell = document.getElementById("bacteriaCell");

    if (!virus || !cell) return;

    /* stop idle jitter before animation */
    virus.style.animation = "none";

    virus.className = "";
    void virus.offsetWidth;

    virus.classList.add("injecting");

    setTimeout(() => {
        virus.classList.add("grabbing");
    }, 2200);

    setTimeout(() => {
        virus.classList.add("attached");
    }, 2800);

    setTimeout(() => {

        const rna = document.createElement("div");

        rna.className = "rnaInject";

        virus.appendChild(rna);

        cell.classList.add("infectedPulse");

    }, 3400);

    setTimeout(() => {

        cell.classList.add("deadCell");

    }, 5200);

    setTimeout(() => {

        cell.classList.add("lysing");

    }, 6700);
}

/* =========================
   EXPORTS
========================= */

window.openTab = openTab;
window.closeTabs = closeTabs;
window.revealVideo = revealVideo;
window.validateSequence = validateSequence;
window.runInfection = runInfection;