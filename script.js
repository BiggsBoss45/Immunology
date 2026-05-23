let stage = 0;
let bootState = "idle";
let started = false;

const clickSound = new Audio("click.mp3");
const rebootSound = new Audio("reboot.mp3");

const sequences = [
    "B-01.html","C-09.html","E-13.html","L-12.html",
    "M-22.html","P-09.html","S-05.html","V-03.html","H-07.html"
];

let dnaLoaded = false;

/* =========================
   INIT
========================= */

window.addEventListener("load", () => {
    stage = 0;
    bootState = "idle";
    started = false;
    showScreen("startScreen");
});

/* =========================
   INPUT
========================= */

document.addEventListener("keydown", (e) => {
    if (stage === 0 && e.key === "Enter") startSequence();
    if (stage === 2 && e.key === "Enter") continueToMenu();
});

document.addEventListener("click", () => {
    if (stage === 0) startSequence();
    if (stage === 2) continueToMenu();
});

/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}

/* =========================
   START
========================= */

function startSequence(){
    if (started) return;
    started = true;

    stage = 1;
    showScreen("bootScreen");

    setTimeout(() => {
        showScreen("continueScreen");
        stage = 2;
        bootState = "continue";
    }, 6000);
}

/* =========================
   MENU
========================= */

function continueToMenu(){
    stage = 3;
    showScreen("menuScreen");
}

/* =========================
   PHASE 3 ENTRY (MICROSCOPE ZOOM)
========================= */

function enterPhase3(){
    stage = 4;

    showScreen("phase3Screen");

    const screen = document.getElementById("phase3Screen");
    screen.classList.add("zoomIn");

    setTimeout(() => {
        screen.classList.remove("zoomIn");
    }, 1500);
}

/* =========================
   SIMULATION CORE
========================= */

function runSimulation(){

    const pathway = document.getElementById("pathwaySelect").value;
    const atp = document.getElementById("atpSelect").value;
    const mutation = document.getElementById("mutationSelect").value;

    const bacteria = document.getElementById("bacteriaCell");
    const virus = document.getElementById("virusParticle");
    const rna = document.getElementById("rnaStrand");

    const result = document.getElementById("simulationResult");
    const atpBar = document.getElementById("atpBarInner");
    const atpValue = document.getElementById("atpValue");

    /* RESET */
    bacteria.className = "";
    virus.className = "";
    if (rna) rna.className = "";

    result.textContent = "Injecting viral RNA...";
    atpBar.style.width = "0%";

    /* RNA ANIMATION FIRST */
    if (rna) {
        rna.classList.add("rnaInject");
    }

    setTimeout(() => {

        virus.classList.add("injecting");

        /* =========================
           FAIL - LYSIS
        ========================= */

        if (pathway === "electron" && atp === "extreme") {

            bacteria.classList.add("deadCell");

            setTimeout(() => {
                bacteria.classList.add("lysing");
            }, 600);

            atpBar.style.width = "100%";
            atpValue.textContent = "ATP OVERLOAD";

            result.textContent = "Cell lysis detected. System failure.";

            return;
        }

        /* FAIL MUTATION */
        if (mutation === "repair" && atp === "elevated") {

            bacteria.classList.add("failedMutation");

            atpBar.style.width = "45%";
            atpValue.textContent = "45 ATP";

            result.textContent = "Unstable mutation. Host collapse imminent.";

            return;
        }

        /* SUCCESS */
        if (pathway === "krebs" && atp === "elevated" && mutation === "enzyme") {

            bacteria.classList.add("mutatedCell");

            atpBar.style.width = "78%";
            atpValue.textContent = "78 ATP";

            result.textContent = "Stable viral integration achieved.";

            return;
        }

        /* DEFAULT */
        bacteria.classList.add("stableCell");

        atpBar.style.width = "30%";
        atpValue.textContent = "30 ATP";

        result.textContent = "No significant mutation detected.";

    }, 1600);
}
