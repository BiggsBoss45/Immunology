alert("SCRIPT IS RUNNING");
console.log("SCRIPT LOADED");

let stage = 0;
let bootState = "idle";
let started = false;
let locked = false;
let audioUnlocked = false;

/* =========================
   AUDIO SYSTEM (FIXED)
========================= */

const clickSound = new Audio("click.mp3");
const rebootSound = new Audio("reboot.mp3");

clickSound.preload = "auto";
rebootSound.preload = "auto";

function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    // must be triggered by user gesture
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

function playReboot() {
    if (!audioUnlocked) return;
    rebootSound.currentTime = 0;
    rebootSound.play().catch(() => {});
}

/* =========================
   ERROR DEBUG
========================= */

window.addEventListener("error", (e) => {
    console.log("JS ERROR:", e.message);
});

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
   INPUT SYSTEM
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    unlockAudio();
    handleStart();
});

document.addEventListener("click", () => {
    unlockAudio();
    handleStart();
});

function handleStart() {

    if (locked) return;

    if (stage === 0) startSequence();
    else if (stage === 2 && bootState === "continue") continueToMenu();
}

/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id) {

    document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));

    const el = document.getElementById(id);
    if (el) el.classList.add("active");
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

    playReboot();
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
   TAB SYSTEM (MAIN MENU)
========================= */

function openTab(tabId) {

    playClick();

    const menuGrid = document.querySelector("#menuScreen .menuGrid");
    if (menuGrid) menuGrid.style.display = "none";

    document.querySelectorAll("#menuScreen .tabContent")
        .forEach(tab => tab.classList.remove("activeTab"));

    const target = document.getElementById(tabId);
    if (target) target.classList.add("activeTab");

    if (tabId === "dnaTab") loadDNA();
}

function closeTabs() {

    playClick();

    document.querySelectorAll("#menuScreen .tabContent")
        .forEach(tab => tab.classList.remove("activeTab"));

    const menuGrid = document.querySelector("#menuScreen .menuGrid");
    if (menuGrid) menuGrid.style.display = "flex";
}

/* =========================
   VIDEO
========================= */

function revealVideo() {

    playClick();

    const video = document.getElementById("mainVideo");
    const container = document.getElementById("videoContainer");
    const button = document.getElementById("revealButton");

    if (!video || !container || !button) return;

    container.style.display = "block";
    button.style.display = "none";

    video.src = "video1.mp4";
    video.load();
}

/* =========================
   DNA SYSTEM (FIXED)
========================= */

function loadDNA() {

    const dnaList = document.getElementById("dnaList");
    if (!dnaList) return;

    if (dnaList.childElementCount > 0) return;

    const sequences = [
        "B-01","C-09","E-13","L-12",
        "M-22","P-09","S-05","V-03","H-07"
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

    console.log("DNA LOADED");
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

    setTimeout(() => {
        screen.classList.remove("zoomIn");
    }, 1200);
}

/* =========================
   PHASE 3 TAB SYSTEM (FIXED MISSING FUNCTIONS)
========================= */

function openPhase3Tab(tabId) {

    playClick();

    const menuGrid = document.querySelector("#phase3Screen .menuGrid");
    if (menuGrid) menuGrid.style.display = "none";

    document.querySelectorAll("#phase3Screen .tabContent")
        .forEach(t => t.classList.remove("activeTab"));

    const target = document.getElementById(tabId);
    if (target) target.classList.add("activeTab");
}

function closePhase3() {

    playClick();

    document.querySelectorAll("#phase3Screen .tabContent")
        .forEach(t => t.classList.remove("activeTab"));

    const menuGrid = document.querySelector("#phase3Screen .menuGrid");
    if (menuGrid) menuGrid.style.display = "flex";
}

/* =========================
   SIMULATION CORE (FIXED)
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
    const atp = document.getElementById("atpSelect")?.value;
    const mutation = document.getElementById("mutationSelect")?.value;

    bacteria.className = "";
    virus.className = "";
    if (rna) rna.className = "";

    result.textContent = "Injecting viral RNA...";
    atpBar.style.width = "0%";
    atpValue.textContent = "0 ATP";

    if (rna) rna.classList.add("rnaInject");

    setTimeout(() => {

        virus.classList.add("injecting");

        if (pathway === "electron" && atp === "extreme") {

            bacteria.classList.add("deadCell");

            setTimeout(() => bacteria.classList.add("lysing"), 500);

            atpBar.style.width = "100%";
            atpValue.textContent = "ATP OVERLOAD";
            result.textContent = "Cell lysis detected.";
            return;
        }

        if (mutation === "repair" && atp === "elevated") {

            bacteria.classList.add("failedMutation");

            atpBar.style.width = "45%";
            atpValue.textContent = "45 ATP";
            result.textContent = "Unstable mutation.";
            return;
        }

        if (pathway === "krebs" && atp === "elevated" && mutation === "enzyme") {

            bacteria.classList.add("mutatedCell");

            atpBar.style.width = "78%";
            atpValue.textContent = "78 ATP";
            result.textContent = "Stable integration confirmed.";
            return;
        }

        bacteria.classList.add("stableCell");

        atpBar.style.width = "30%";
        atpValue.textContent = "30 ATP";
        result.textContent = "No significant mutation detected.";

    }, 1400);
}

/* =========================
   GLOBAL EXPORTS
========================= */

window.openTab = openTab;
window.closeTabs = closeTabs;
window.revealVideo = revealVideo;
window.checkPhase2 = checkPhase2;
window.runSimulation = runSimulation;
window.openPhase3Tab = openPhase3Tab;
window.closePhase3 = closePhase3;
window.enterPhase3 = enterPhase3;