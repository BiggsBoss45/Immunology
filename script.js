console.log("JS FILE LOADED");
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
    console.log("handleStart fired");

    if (locked) return;

    if (stage === 0) startSequence();

    if (stage === 2 && bootState === "continue") continueToMenu();
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

    target.style.display = "flex";
    target.classList.add("active");
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
function toggleGuide() {

    const guide = document.getElementById("translationGuide");
    if (!guide) return;

    guide.style.display =
        guide.style.display === "none" ? "block" : "none";
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

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function generateRecoveredDNA() {

    const container = document.getElementById("dnaList");
    if (!container) return;

    container.innerHTML = "";

    const organisms = [
        {
            name: "V-03",
            correct: true,
            sequences: [
                "ATGGAGCCCTGCAAGGGCTTCCGCAAGTGG",
                "GGTACCGTAGCTAACCGTAGGCTAACCGTA",
                "TTAGCGATCGGATCGTAGCTAACCGGATCG",
                "AACCGTAGCTAGCTAACCGTAGGCTAACCG"
            ]
        },
        {
            name: "E-13",
            correct: true,
            sequences: [
                "TTTATGGACCCCTGCAAGGGCCTGCGCTAA",
                "GCTAACCGTAGGCTAACCGTAGCTAACCGT",
                "AACCGTAGCTAACCGTAGGCTAACCGTAGC",
                "TTGACCGTAGCTAACCGTAGGCTAACCGTA"
            ]
        },
        {
            name: "H-07",
            correct: true,
            sequences: [
                "ATGCCCGGCTTCAAGCGCTGCGAATTGGCG",
                "GCTAACCGTAGCTAACCGTAGGCTAACCGT",
                "TTACCGTAGCTAACCGTAGGCTAACCGTAG",
                "AACCGTAGGCTAACCGTAGCTAACCGTAGC"
            ]
        },
        {
            name: "P-09",
            correct: true,
            sequences: [
                "ATGGCGTGGAACCCCGAGTTCCGCAAGTGC",
                "TTACCGTAGCTAACCGTAGGCTAACCGTAG",
                "GCTAACCGTAGGCTAACCGTAGCTAACCGT",
                "AACCGTAGCTAACCGTAGGCTAACCGTAGC"
            ]
        },

        /* DECOYS */
        {
            name: "S-05",
            correct: false,
            sequences: [
                "GCTAACCGTAGGCTAACCGTAGGCTAACCG",
                "TTACCGGATCGATCGTAGCTAGGCTAACCG",
                "GCGTTAACCGGTAGCTAACCGTAGCTAACG",
                "CCGTAGGCTAACCGTAGGCTAACCGTAGGC"
            ]
        },
        {
            name: "M-22",
            correct: false,
            sequences: [
                "TTGCGATACCGGTTAGCGATACCGGTTAAC",
                "GATCGTAGCTAACCGTAGCTAACCGTAGCT",
                "TTACCGTAGGCTAACCGTAGGATCGTAGGC",
                "CGTAGCTAACCGTAGGCTAACCGTAGCTAA"
            ]
        },
        {
            name: "L-12",
            correct: false,
            sequences: [
                "AACCGGTTAACCGGTTAACCGGTTAACCGG",
                "GATCGTAGCTAACCGTAGCTAACCGTAGGC",
                "TTAGCGATCGTAGCTAACCGTAGGCTAACG",
                "CCGTAGCTAACCGTAGGCTAACCGTAGCTA"
            ]
        },
        {
            name: "B-01",
            correct: false,
            sequences: [
                "CGATGGTACCGATGGTACCGATGGTACCGA",
                "TTAGCGTAGCTAACCGTAGGCTAACCGTAG",
                "GATCGTAGCTAGGCTAACCGTAGCTAACCG",
                "AACCGGTTAACCGGTTAACCGGTTAACCGG"
            ]
        },
        {
            name: "C-17",
            correct: false,
            sequences: [
                "GGGATCCGGGATCCGGGATCCGGGATCCGG",
                "TTAGCGTAGCTAACCGTAGGCTAACCGTAA",
                "GATCGTAGCTAACCGTAGCTAACCGTAGCT",
                "AACCGTAGGCTAACCGTAGCTAACCGTAGG"
            ]
        }
    ];

    shuffle(organisms);

    organisms.forEach(org => {

        const file = document.createElement("div");
        file.className = "dnaFile";

        const title = document.createElement("h3");
        title.textContent = org.name;

        file.appendChild(title);

        org.sequences.forEach(seq => {
            const line = document.createElement("div");
            line.className = "dnaSequence";
            line.textContent = seq;
            file.appendChild(line);
        });

        container.appendChild(file);
    });
}
/* =========================
   PROTEIN DISPLAY
========================= */

function generateProteinSequence() {

    const container = document.getElementById("proteinSequence");
    if (!container) return;

    const codons = container.querySelectorAll(".codon");

    codons.forEach(c => {
        c.classList.add("activeCodon");
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

function validatePhase2() {

    playClick();

    const selected = Array.from(
        document.querySelectorAll("#orgList input[type='checkbox']:checked")
    ).map(cb => cb.value);

    const correct = ["V-03", "E-13", "H-07", "P-09"];

    const output = document.getElementById("phase2Result");
    const unlock = document.getElementById("phase2Access");

    if (!output) return;

    const sortedSelected = selected.sort().join(",");
    const sortedCorrect = correct.sort().join(",");

    if (sortedSelected === sortedCorrect) {

        output.innerHTML = `<span style="color:#4cff88">SEQUENCE VALIDATED</span>`;

        if (unlock) {
            unlock.style.display = "block";
        }

        stage = 4;

        const overlay = document.getElementById("glitchOverlay");

        if (overlay) {
            overlay.classList.remove("glitchActive");
            void overlay.offsetWidth;
            overlay.classList.add("glitchActive");
        }

       setTimeout(() => {

    // hide everything
    document.querySelectorAll(".screen, .tabContent").forEach(el => {
        el.classList.remove("active");
        el.classList.remove("activeTab");
        el.style.display = "none";
    });

    // show phase 3
    const phase3 = document.getElementById("phase3Screen");

    if (!phase3) {
        console.error("PHASE 3 SCREEN NOT FOUND");
        return;
    }

    phase3.classList.add("active");
    phase3.style.display = "flex";

    console.log("PHASE 3 LOADED");

}, 1200);
    } else {

        output.innerHTML = `<span style="color:#ff5577">INVALID SEQUENCE</span>`;
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

function initStartControls() {

    const startScreen = document.getElementById("startScreen");

    if (!startScreen) {
        console.error("Start screen not found");
        return;
    }

    startScreen.addEventListener("click", handleStart);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleStart();
    });

    console.log("Start controls initialized");
}

window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM READY");

    initStartControls();
});
