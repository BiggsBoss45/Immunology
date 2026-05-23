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
   INPUT (FIXED + SAFE)
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    if (stage === 0) startSequence();
    else if (stage === 2 && bootState === "continue") continueToMenu();
});

document.addEventListener("click", () => {
    if (stage === 0) startSequence();
    else if (stage === 2 && bootState === "continue") continueToMenu();
});

/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id){
    document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));

    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}

/* =========================
   START SEQUENCE
========================= */

function startSequence(){
    if (started) return;
    started = true;

    stage = 1;
    bootState = "booting";

    showScreen("bootScreen");

    setTimeout(() => {
        stage = 2;
        bootState = "continue";
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
   PHASE 3 ENTRY (SAFE)
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
   SIMULATION CORE (FIXED TIMING)
========================= */

function runSimulation(){

    const pathway = document.getElementById("pathwaySelect")?.value;
    const atp = document.getElementById("atpSelect")?.value;
    const mutation = document.getElementById("mutationSelect")?.value;

    const bacteria = document.getElementById("bacteriaCell");
    const virus = document.getElementById("virusParticle");
    const rna = document.getElementById("rnaStrand");

    const result = document.getElementById("simulationResult");
    const atpBar = document.getElementById("atpBarInner");
    const atpValue = document.getElementById("atpValue");

    if (!bacteria || !virus || !result) return;

    /* RESET STATES */
    bacteria.className = "";
    virus.className = "";
    if (rna) rna.className = "";

    result.textContent = "Injecting viral RNA...";
    atpBar.style.width = "0%";
    atpValue.textContent = "0 ATP";

    /* =========================
       STEP 1: RNA ENTRY
    ========================= */

    if (rna) rna.classList.add("rnaInject");

    setTimeout(() => {

        /* STEP 2: VIRUS INJECTION */
        virus.classList.add("injecting");

        /* =========================
           FAIL: LYSIS SEQUENCE
        ========================= */

        if (pathway === "electron" && atp === "extreme") {

            bacteria.classList.add("deadCell");

            setTimeout(() => {
                bacteria.classList.add("lysing");
            }, 600);

            atpBar.style.width = "100%";
            atpValue.textContent = "ATP OVERLOAD";
            result.textContent = "Cell lysis detected. Membrane rupture confirmed.";

            return;
        }

        /* FAIL MUTATION */
        if (mutation === "repair" && atp === "elevated") {

            bacteria.classList.add("failedMutation");

            atpBar.style.width = "45%";
            atpValue.textContent = "45 ATP";
            result.textContent = "Unstable mutation. No sustained replication.";

            return;
        }

        /* SUCCESS */
        if (pathway === "krebs" && atp === "elevated" && mutation === "enzyme") {

            bacteria.classList.add("mutatedCell");

            atpBar.style.width = "78%";
            atpValue.textContent = "78 ATP";
            result.textContent = "Stable integration achieved. Enhanced ATP production confirmed.";

            return;
        }

        /* DEFAULT */
        bacteria.classList.add("stableCell");

        atpBar.style.width = "30%";
        atpValue.textContent = "30 ATP";
        result.textContent = "No significant mutation detected.";

    }, 1400);
}
