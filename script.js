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
   INPUT
========================= */

document.addEventListener("keydown", (e) => {

    if (e.key !== "Enter") return;

    unlockAudio();
    handleStart();

});

document.addEventListener("click", () => {

    unlockAudio();

});

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

    const menu = document.getElementById("menuScreen");

    if (menu) {
        menu.style.display = "none";
    }

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
        target.style.width = "100vw";
        target.style.height = "100vh";
        target.style.zIndex = "9999";
        target.style.background = "black";
        target.style.overflowY = "auto";

    }

    if (tabId === "dnaTab") {
        loadDNA();
    }

}

function closeTabs() {

    playClick();

    document.querySelectorAll(".tabContent").forEach(tab => {

        tab.classList.remove("activeTab");
        tab.style.display = "none";

    });

    const menu = document.getElementById("menuScreen");

    if (menu) {
        menu.style.display = "flex";
    }

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
   DNA SYSTEM
========================= */

function loadDNA() {

    const dnaList = document.getElementById("dnaList");

    if (!dnaList || dnaList.childElementCount > 0) return;

    const sequences = [
        "B-01",
        "C-09",
        "E-13",
        "L-12",
        "M-22",
        "P-09",
        "S-05",
        "V-03",
        "H-07"
    ];

    dnaList.innerHTML = "";

    sequences.forEach(seq => {

        const item = document.createElement("div");

        item.textContent = "DNA SEQUENCE: " + seq;

        item.style.padding = "14px";
        item.style.borderBottom = "1px solid #333";
        item.style.fontSize = "18px";

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

        setTimeout(() => {

            enterPhase3();

        }, 1000);

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

    setTimeout(() => {

        screen.classList.remove("zoomIn");

    }, 1200);

}

/* =========================
   PHASE 3 TAB SYSTEM
========================= */

function openPhase3Tab(tabId) {

    playClick();

    const menuGrid = document.querySelector("#phase3Screen .menuGrid");

    if (menuGrid) {
        menuGrid.style.display = "none";
    }

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
        target.style.width = "100vw";
        target.style.height = "100vh";
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

    if (menuGrid) {
        menuGrid.style.display = "flex";
    }

}

/* =========================
   SIMULATION CORE
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
       RESET VISUAL STATE
    ========================= */

    bacteria.className = "";
    virus.className = "";
    if (rna) rna.className = "";

    result.textContent = "Injecting viral RNA...";
    atpBar.style.width = "0%";
    atpValue.textContent = "0 ATP";

    if (rna) rna.classList.add("rnaInject");

    /* =========================
       BASE PATHWAY VALUES
    ========================= */

    let baseATP = 50;
    let stability = 50;   // resistance to virus
    let vulnerability = 50;

    switch (pathway) {

        case "glycolysis":
            baseATP = 40;
            stability = 45;
            vulnerability = 55;
            break;

        case "krebs":
            baseATP = 70;
            stability = 60;
            vulnerability = 40;
            break;

        case "electron":
            baseATP = 90;
            stability = 35;
            vulnerability = 70;
            break;

        case "fermentation":
            baseATP = 25;
            stability = 55;
            vulnerability = 45;
            break;

        case "pentose":
            baseATP = 50;
            stability = 80;
            vulnerability = 30;
            break;

        case "fatty":
            baseATP = 60;
            stability = 65;
            vulnerability = 50;
            break;
    }

    /* =========================
       ATP MODIFIERS
    ========================= */

    let atpMultiplier = 1;

    switch (atpState) {

        case "depleted": atpMultiplier = 0.3; break;
        case "low": atpMultiplier = 0.6; break;
        case "baseline": atpMultiplier = 1; break;
        case "elevated": atpMultiplier = 1.2; break;
        case "high": atpMultiplier = 1.4; break;
        case "extreme": atpMultiplier = 1.7; break;
        case "overload": atpMultiplier = 2.0; break;
    }

    /* =========================
       MUTATION MODIFIERS
    ========================= */

    let stabilityModifier = 1;
    let virusResistanceModifier = 1;
    let chaos = 0;

    switch (mutation) {

        case "none":
            stabilityModifier = 0.8;
            break;

        case "repair":
            stabilityModifier = 1.2;
            break;

        case "enzyme":
            stabilityModifier = 1.3;
            break;

        case "resistant":
            virusResistanceModifier = 1.5;
            break;

        case "suppression":
            virusResistanceModifier = 0.7;
            break;

        case "error":
            chaos = Math.random() * 30;
            break;

        case "collapse":
            stabilityModifier = 0.5;
            virusResistanceModifier = 0.5;
            break;

        case "hypermutation":
            chaos = Math.random() * 60;
            stabilityModifier = 1.1;
            virusResistanceModifier = 1.1;
            break;
    }

    /* =========================
       VIRUS PRESSURE MODEL
    ========================= */

    const virusPressure = 55 * virusResistanceModifier + chaos;
    const cellDefense = stability * stabilityModifier;
    const finalATP = Math.round(baseATP * atpMultiplier);

    /* =========================
       VISUAL UPDATE
    ========================= */

    atpBar.style.width = Math.min(finalATP, 100) + "%";
    atpValue.textContent = finalATP + " ATP";

    /* =========================
       VIRUS ANIMATION START
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
       OUTCOME ENGINE
    ========================= */

    setTimeout(() => {

        const infectionScore = virusPressure - cellDefense;

        if (finalATP >= 120 && infectionScore < 0) {

            bacteria.classList.add("stableCell");
            result.textContent = "Strong metabolic resistance detected.";
            return;
        }

        if (infectionScore > 60 || atpState === "depleted") {

            bacteria.classList.add("deadCell");

            setTimeout(() => {
                bacteria.classList.add("lysing");
            }, 500);

            result.textContent = "Cell lysis detected.";
            return;
        }

        if (infectionScore > 20) {

            bacteria.classList.add("failedMutation");
            result.textContent = "Unstable infection — partial control.";
            return;
        }

        if (chaos > 40) {

            bacteria.classList.add("mutatedCell");
            result.textContent = "Hypermutation event stabilized.";
            return;
        }

        bacteria.classList.add("stableCell");
        result.textContent = "No significant infection detected.";

    }, 1800);
}

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
