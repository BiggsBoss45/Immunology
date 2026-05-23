let stage = 0;

let bootState = "idle";
// idle → booting → continue → menu

const clickSound = new Audio("click.mp3");

/* =========================
   SEQUENCE SYSTEM
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
let dnaLoaded = false;

/* =========================
   INPUT LISTENERS
========================= */

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

/* =========================
   CLICK AUDIO
========================= */

function playClick(){
    clickSound.currentTime = 0;
    clickSound.play();
}

/* =========================
   VIDEO SAFETY CONTROL
========================= */

function stopVideoLog(){
    const video = document.getElementById("mainVideo");

    if(video){
        video.pause();
        video.currentTime = 0;
        video.muted = true;
    }
}

/* =========================
   VECTOR DRAW SYSTEM
========================= */

function initVectorLines(){
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

function destroyVector(){
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

function handleStart(){

    if(bootState === "booting") return;

    if(stage === 0){

        bootState = "booting";
        playClick();

        document.getElementById("startScreen")?.classList.remove("active");
        document.getElementById("bootScreen")?.classList.add("active");

        const bootAudio = document.getElementById("bootAudio");
        if(bootAudio){
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

    else if(stage === 1 && bootState === "continue"){

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

function openTab(tabId){

    playClick();
    stopVideoLog();

    document.querySelector(".menuGrid").style.display = "none";

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
    });

    const target = document.getElementById(tabId);
    if(target) target.classList.add("activeTab");

    // Load audio sequences once
    if(tabId === "audioTab" && !sequencesLoaded){
        loadSequences();
        sequencesLoaded = true;
    }

    // Load DNA system once
    if(tabId === "dnaTab" && !dnaLoaded){
        loadDNASequences();
        dnaLoaded = true;
    }
}

function closeTabs(){

    playClick();
    stopVideoLog();

    document.querySelectorAll(".tabContent").forEach(tab => {
        tab.classList.remove("activeTab");
    });

    document.querySelector(".menuGrid").style.display = "flex";
}

/* =========================
   AUDIO LOG
========================= */

function revealVideo(){

    playClick();

    const video = document.getElementById("mainVideo");

    if(video){
        video.muted = false;
    }

    const container = document.getElementById("videoContainer");
    if(container) container.style.display = "block";

    const button = document.getElementById("revealButton");
    if(button) button.style.display = "none";
}

/* =========================
   SEQUENCE LOADER (IFRAMES)
========================= */

function shuffleArray(arr){
    let a = [...arr];

    for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

function loadSequences(){

    const container = document.getElementById("sequenceContainer");
    if(!container) return;

    container.innerHTML = "";

    const shuffled = shuffleArray(sequences);

    shuffled.forEach(file => {
        const frame = document.createElement("iframe");
        frame.src = file;
        container.appendChild(frame);
    });
}

/* =========================
   DNA SEQUENCE SYSTEM (NEW MENU)
========================= */

const dnaFiles = [
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

function loadDNASequences(){

    const container = document.getElementById("dnaList");
    if(!container) return;

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

            // close others
            document.querySelectorAll("#dnaList .seqContent")
                .forEach(c => c.classList.remove("active"));

            document.querySelectorAll("#dnaList .block")
                .forEach(b => {
                    b.classList.add("collapsed");
                    b.classList.remove("expanded");
                });

            // toggle clicked
            if(!isOpen){
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

function checkPhase2(){

    playClick();

    const selected = Array.from(
        document.querySelectorAll("#orgList input:checked")
    ).map(el => el.value);

    const correct = ["V-03", "E-13", "H-07", "P-09"];

    const success =
        selected.length === correct.length &&
        correct.every(code => selected.includes(code));

    const result = document.getElementById("phase2Result");

    if(result){
        result.innerHTML = success
            ? "SEQUENCE VALIDATED"
            : "INVALID VECTOR COMBINATION";
    }

    if(success){
        unlockPhase2();
    }
}

/* =========================
   PHASE 2 UNLOCK
========================= */

function unlockPhase2(){

    const unlock = document.getElementById("phase2Access");

    if(unlock){
        unlock.style.display = "block";
    }

    document.body.style.filter =
        "contrast(1.1) brightness(1.05)";
}

/* =========================
   BLOCK VIEWER (OLD SUPPORT)
========================= */

document.addEventListener("DOMContentLoaded", () => {
    initBlockViewer();
});

function initBlockViewer(){

    const blocks = document.querySelectorAll(".block");

    blocks.forEach(block => {

        block.classList.add("collapsed");

        block.addEventListener("click", () => {

            const isOpen = block.classList.contains("expanded");

            blocks.forEach(b => {
                b.classList.remove("expanded");
                b.classList.add("collapsed");
            });

            if(!isOpen){
                block.classList.remove("collapsed");
                block.classList.add("expanded");
            }
        });
    });

    const firstVector =
        document.querySelector(".vector")?.closest(".block");

    if(firstVector){
        firstVector.classList.add("expanded");
        firstVector.classList.remove("collapsed");
    }
}
