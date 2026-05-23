alert("SCRIPT IS RUNNING");
console.log("SCRIPT LOADED");

let stage = 0;
let bootState = "idle";
let started = false;
let locked = false;

const clickSound = new Audio("click.mp3");
const rebootSound = new Audio("reboot.mp3");

const sequences = [
    "B-01.html","C-09.html","E-13.html","L-12.html",
    "M-22.html","P-09.html","S-05.html","V-03.html","H-07.html"
];

let dnaLoaded = false;

/* =========================
   DEBUG SAFETY (IMPORTANT)
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

    if (typeof showScreen === "function") {
        showScreen("startScreen");
    } else {
        console.warn("showScreen() missing");
    }
});

/* =========================
   INPUT (BULLETPROOF)
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    handleStart();
});

document.addEventListener("click", () => {
    handleStart();
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
   SCREEN SYSTEM SAFETY WRAPPER
========================= */

function showScreen(id){

    const screens = document.querySelectorAll(".screen");
    if (!screens.length) return;

    screens.forEach(s => s.classList.remove("active"));

    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}

/* =========================
   START SEQUENCE
========================= */

function startSequence(){

    if (started) return;
    started = true;
    locked = true;

    stage = 1;
    bootState = "booting";

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

function continueToMenu(){

    stage = 3;
    bootState = "menu";

    showScreen("menuScreen");
}

/* =========================
   PHASE 3 ENTRY
========================= */

function enterPhase3(){

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
   SIMULATION CORE (SAFE)
========================= */

function runSimulation(){

    const bacteria = document.getElementById("bacteriaCell");
    const virus = document.getElementById("virusParticle");
    const rna = document.getElementById("rnaStrand");
    const result = document.getElementById("simulationResult");
    const atpBar = document.getElementById("atpBarInner");
    const atpValue = document.getElementById("atpValue");

    if (!bacteria || !virus || !result || !atpBar || !atpValue) {
        console.warn("Missing simulation elements");
        return;
    }

    const pathway = document.getElementById("pathwaySelect")?.value;
    const atp = document.getElementById("atpSelect")?.value;
    const mutation = document.getElementById("mutationSelect")?.value;

    /* RESET */
    bacteria.className = "";
    virus.className = "";
    if (rna) rna.className = "";

    result.textContent = "Injecting viral RNA...";
    atpBar.style.width = "0%";
    atpValue.textContent = "0 ATP";

    /* =========================
       RNA PHASE
    ========================= */

    if (rna) rna.classList.add("rnaInject");

    setTimeout(() => {

        if (!virus) return;

        virus.classList.add("injecting");

        /* =========================
           LYSIS FAILURE
        ========================= */

        if (pathway === "electron" && atp === "extreme") {

            bacteria.classList.add("deadCell");

            setTimeout(() => {
                bacteria.classList.add("lysing");
            }, 500);

            atpBar.style.width = "100%";
            atpValue.textContent = "ATP OVERLOAD";
            result.textContent = "Cell lysis detected.";

            return;
        }

        /* MUTATION FAILURE */
        if (mutation === "repair" && atp === "elevated") {

            bacteria.classList.add("failedMutation");

            atpBar.style.width = "45%";
            atpValue.textContent = "45 ATP";
            result.textContent = "Unstable mutation.";

            return;
        }

        /* SUCCESS */
        if (pathway === "krebs" && atp === "elevated" && mutation === "enzyme") {

            bacteria.classList.add("mutatedCell");

            atpBar.style.width = "78%";
            atpValue.textContent = "78 ATP";
            result.textContent = "Stable integration confirmed.";

            return;
        }

        /* DEFAULT */
        bacteria.classList.add("stableCell");

        atpBar.style.width = "30%";
        atpValue.textContent = "30 ATP";
        result.textContent = "No significant mutation detected.";

    }, 1400);
}
