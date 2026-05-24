document.addEventListener("DOMContentLoaded", () => {
    showScreen("startScreen");

    document.querySelectorAll(".tabContent").forEach(t => {
        t.style.display = "none";
    });
});

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
    showScreen("startScreen");
});

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

    console.log("SWITCHING SCREEN:", id);

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
   SIMULATION CORE (UPDATED + STABLE)
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

    /* =========================
       SAFE RESET (NO CLASSNAME WIPE)
    ========================= */

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

    if (rna) rna.classList.remove("rnaInject");

    /* reset UI */
    result.textContent = "Injecting viral RNA...";
    atpBar.style.width = "0%";
    atpValue.textContent = "0 ATP";

    /* =========================
       FORCE REPAINT (CRITICAL FIX FOR ANIMATION VISIBILITY)
    ========================= */

    void virus.offsetWidth;

    /* =========================
       RNA ANIMATION
    ========================= */

    if (rna) {
        rna.classList.add("rnaInject");
    }

    /* =========================
       VIRUS ANIMATION TIMELINE
    ========================= */

    setTimeout(() => {
        virus.classList.add("injecting");
    }, 200);

    setTimeout(() => {
        virus.classList.add("grabbing");
    }, 900);

    setTimeout(() => {
        virus.classList.add("attached");
    }, 1400);

    /* =========================
       DYNAMIC SIMULATION LOGIC (FIXED - NO MORE STATIC 55)
    ========================= */

    let baseRisk = 55;

    // pathway effects
    switch (pathway) {
        case "glycolysis": baseRisk += 5; break;
        case "krebs": baseRisk -= 5; break;
        case "electron": baseRisk += 10; break;
        case "fermentation": baseRisk += 0; break;
        case "pentose": baseRisk -= 10; break;
        case "fatty": baseRisk -= 5; break;
    }

    // ATP effects
    switch (atpState) {
        case "depleted": baseRisk += 25; break;
        case "low": baseRisk += 10; break;
        case "high": baseRisk -= 10; break;
        case "extreme": baseRisk -= 15; break;
    }

    // mutation effects
    switch (mutation) {
        case "resistant": baseRisk -= 25; break;
        case "suppression": baseRisk += 15; break;
        case "error": baseRisk += Math.random() * 20; break;
        case "collapse": baseRisk += 30; break;
        case "hypermutation": baseRisk += Math.random() * 40; break;
    }

    const infectionScore = baseRisk;

    /* =========================
       OUTCOME ENGINE (VARIED RESULTS NOW)
    ========================= */
/* =========================
   OUTCOME ENGINE (VARIED RESULTS NOW)
========================= */

setTimeout(() => {

    // 🔥 ALWAYS show initial infection response
    bacteria.classList.add("infectedPulse");

    // optional: remove pulse after it flashes so it doesn’t stack
    setTimeout(() => {
        bacteria.classList.remove("infectedPulse");
    }, 1200);

    if (infectionScore > 80) {

        bacteria.classList.add("deadCell");

        setTimeout(() => {
            bacteria.classList.add("lysing");
        }, 500);

        result.textContent = "CELL LYSIS DETECTED";

    } else if (infectionScore > 60) {

        bacteria.classList.add("failedMutation");
        result.textContent = "Unstable infection response";

    } else if (infectionScore > 40) {

        bacteria.classList.add("mutatedCell");
        result.textContent = "Host mutation response triggered";

    } else {

        bacteria.classList.add("stableCell");
        result.textContent = "No significant infection detected";
    }

}, 1800);
    
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
