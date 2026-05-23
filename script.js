let stage = 0;

let bootState = "idle";
// idle → booting → continue → menu

const clickSound = new Audio("click.mp3");

/* =========================
   SEQUENCE DATA (AUDIO TAB)
========================= */

const sequences = [
    "B-01.html",
    "C-09.html",
    "E-13.html",
    "L-12.html",
    "M-22.html",
    "P-09.html",
    "S-05.html",
    "V-03.html",
    "H-07.html"
];

let sequencesLoaded = false;

/* =========================
   DNA DATA (NEW TAB)
========================= */

const dnaFiles = [...sequences];

let dnaLoaded = false;

/* =========================
   INPUT LISTENERS
========================= */

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

/* =========================
   CLICK SOUND
========================= */

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

/* =========================
   VIDEO SAFETY CONTROL
========================= */

function stopVideoLog() {
    const video = document.getElementById("mainVideo");

    if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
    }
}

/* =========================
   VECTOR ANIMATION SYSTEM
========================= */

function initVectorLines() {
    const elements = document.querySelectorAll(".vline");
    const beatInterval = 700;

    elements.forEach((el, i) => {
        setTimeout(() => {
            el.style.opacity = "1";
            el.style.strokeDashoffset = "0";
            el.style.transition = "1.2s linear";
        }, i * beatInterval);
    });
}

function destroyVector() {
    const elements = document.querySelectorAll(".vline");
    const beatInterval = 150;

    elements.forEach((el, i) => {
        setTimeout(() => {
            el.style.transition = "none";
            el.style.strokeDashoffset = "1000";
            el.style.opacity = "0";

            setTimeout(() => {
                el.style.transition = "1.2s linear";
            }, 50);
        }, i * beatInterval);
    });
}

/* =========================
   START / BOOT FLOW
========================= */

function handleStart() {

    if (bootState === "booting") return;

    if (stage === 0) {

        bootState = "booting";
        playClick();

        document.getElementById("startScreen")?.classList.remove("active");
        document.getElementById("bootScreen")?.classList.add("active");

        const bootAudio = document.getElementById("bootAudio");
        if (bootAudio) {
            bootAudio.currentTime = 0;
            bootAudio.play();
        }

        setTimeout(initVectorLines, 300);

        stage = 1;

        setTimeout(() => {

            destroyVector();

            setTimeout(() => {
                document.getElementById("bootScreen")?.classList.remove("active");
                document.getElementById("continueScreen")?.classList.add("active");
                bootState = "continue";
            }, 1200);

        }, 7000);
    }

    else if (stage === 1 && bootState === "continue") {

        playClick();

        document.getElementById("continueScreen")?.classList.remove("active");
        document.getElementById("menuScreen")?.classList.add("active");

        stage = 2;
        bootState = "menu";
    }
}

/* =========================
   MENU SYSTEM
========================= */

function openTab(tabId) {

    playClick();
    stopVideoLog();

    document.querySelector(".menuGrid").style.display = "none";

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
    });

    const target = document.getElementById(tabId);
    if (target) target.classList.add("activeTab");

    // AUDIO SEQUENCES
    if (tabId === "audioTab" && !sequencesLoaded) {
        loadSequences();
        sequencesLoaded = true;
    }

    // DNA TAB
    if (tabId === "dnaTab" && !dnaLoaded) {
        loadDNASequences();
        dnaLoaded = true;
    }
}

function closeTabs() {

    playClick();
    stopVideoLog();

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
    });

    document.querySelector(".menuGrid").style.display = "flex";
}

/* =========================
   VIDEO REVEAL
========================= */

function revealVideo() {

    playClick();

    const video = document.getElementById("mainVideo");
    if (video) video.muted = false;

    document.getElementById("videoContainer")?.style && (document.getElementById("videoContainer").style.display = "block");
    document.getElementById("revealButton")?.style && (document.getElementById("revealButton").style.display = "none");
}

/* =========================
   SHUFFLE
========================= */

function shuffleArray(arr) {
    let a = [...arr];

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

/* =========================
   AUDIO SEQUENCES (IFRAMES)
========================= */

function loadSequences() {

    const container = document.getElementById("sequenceContainer");
    if (!container) return;

    container.innerHTML = "";

    const shuffled = shuffleArray(sequences);

    shuffled.forEach(file => {
        const frame = document.createElement("iframe");
        frame.src = file;
        container.appendChild(frame);
    });
}

/* =========================
   DNA SEQUENCE SYSTEM (NEW TAB)
========================= */

function loadDNASequences() {

    const container = document.getElementById("dnaList");
    if (!container) return;

    container.innerHTML = "";

    dnaFiles.forEach(file => {

        const name = file.replace(".html", "");

        const block = document.createElement("div");
        block.className = "block collapsed";

        const button = document.createElement("button");
        button.className = "seqButton";
        button.textContent = name;

        const content = document.createElement("div");
        content.className = "seqContent";

        const iframe = document.createElement("iframe");
        iframe.src = file;
        iframe.style.width = "100%";
        iframe.style.height = "350px";
        iframe.style.border = "1px solid white";

        content.appendChild(iframe);

        button.addEventListener("click", () => {

            const isOpen = content.classList.contains("active");

            // close all
            document.querySelectorAll("#dnaList .seqContent")
                .forEach(c => c.classList.remove("active"));

            document.querySelectorAll("#dnaList .block")
                .forEach(b => {
                    b.classList.remove("expanded");
                    b.classList.add("collapsed");
                });

            // toggle clicked
            if (!isOpen) {
                content.classList.add("active");
                block.classList.add("expanded");
                block.classList.remove("collapsed");
            }
        });

        block.appendChild(button);
        block.appendChild(content);
        container.appendChild(block);
    });
}

/* =========================
   PHASE 2 VALIDATION
========================= */

function checkPhase2() {

    playClick();

    const selected = Array.from(
        document.querySelectorAll("#orgList input:checked")
    ).map(el => el.value);

    const correct = ["V-03", "E-13", "H-07", "P-09"];

    const success =
        selected.length === correct.length &&
        correct.every(code => selected.includes(code));

    const result = document.getElementById("phase2Result");

    if (result) {
        result.textContent = success
            ? "SEQUENCE VALIDATED"
            : "INVALID VECTOR COMBINATION";
    }

    if (success) unlockPhase2();
}

/* =========================
   PHASE 2 UNLOCK
========================= */

function unlockPhase2() {

    const unlock = document.getElementById("phase2Access");

    if (unlock) {
        unlock.style.display = "block";
    }

    document.body.style.filter = "contrast(1.1) brightness(1.05)";
}
