let stage = 0;
// 0 = start
// 1 = booting
// 2 = continue
// 3 = menu
// 4 = phase3

let bootState = "idle";
let started = false;

const clickSound = new Audio("click.mp3");

const rebootSound = new Audio("reboot.mp3");
rebootSound.preload = "auto";

/* =========================
   DATA
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

    /* START SCREEN */
    if (stage === 0 && e.key === "Enter") {
        startSequence();
        return;
    }

    /* CONTINUE SCREEN */
    if (
        stage === 2 &&
        bootState === "continue" &&
        e.key === "Enter"
    ) {
        continueToMenu();
    }

});

/* ONLY START SCREEN CLICK */
document.addEventListener("click", (e) => {

    if (stage === 0) {
        startSequence();
        return;
    }

    if (
        stage === 2 &&
        bootState === "continue"
    ) {
        continueToMenu();
    }

});

/* =========================
   SOUND
========================= */

function playClick() {

    clickSound.currentTime = 0;

    clickSound.play().catch(() => {});

}

/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id) {

    document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));

    const el = document.getElementById(id);

    if (el) {
        el.classList.add("active");
    }
}

/* =========================
   START SEQUENCE
========================= */

function startSequence() {

    if (started) return;

    started = true;

    stage = 1;
    bootState = "booting";

    playClick();

    showScreen("bootScreen");

    const bootAudio =
        document.getElementById("bootAudio");

    if (bootAudio) {

        bootAudio.currentTime = 0;

        bootAudio.play().catch(() => {});

    }

    setTimeout(() => {

        showScreen("continueScreen");

        stage = 2;
        bootState = "continue";

    }, 8000);

}

/* =========================
   CONTINUE → MENU
========================= */

function continueToMenu() {

    playClick();

    stage = 3;
    bootState = "menu";

    showScreen("menuScreen");

}

/* =========================
   MENU
========================= */

function openTab(tabId) {

    playClick();

    stopVideoLog();

    const menuGrid =
        document.querySelector("#menuScreen .menuGrid");

    if (menuGrid) {
        menuGrid.style.display = "none";
    }

    document.querySelectorAll("#menuScreen .tabContent")
        .forEach(tab => {
            tab.classList.remove("activeTab");
        });

    const target =
        document.getElementById(tabId);

    if (target) {
        target.classList.add("activeTab");
    }

    /* DNA LOAD */

    if (
        tabId === "dnaTab" &&
        !dnaLoaded
    ) {

        loadDNASequences();

        dnaLoaded = true;
    }
}

function closeTabs() {

    playClick();

    stopVideoLog();

    document.querySelectorAll("#menuScreen .tabContent")
        .forEach(tab => {
            tab.classList.remove("activeTab");
        });

    const menuGrid =
        document.querySelector("#menuScreen .menuGrid");

    if (menuGrid) {
        menuGrid.style.display = "flex";
    }

}

/* =========================
   VIDEO
========================= */

function stopVideoLog() {

    const video =
        document.getElementById("mainVideo");

    const container =
        document.getElementById("videoContainer");

    const button =
        document.getElementById("revealButton");

    if (video) {

        video.pause();

        video.removeAttribute("src");

        video.load();
    }

    if (container) {
        container.style.display = "none";
    }

    if (button) {
        button.style.display = "inline-block";
    }

}

function revealVideo() {

    playClick();

    const video =
        document.getElementById("mainVideo");

    const container =
        document.getElementById("videoContainer");

    const button =
        document.getElementById("revealButton");

    if (!video) return;

    container.style.display = "block";

    button.style.display = "none";

    video.src = "video1.mp4";

    video.load();

}

/* =========================
   DNA SYSTEM
========================= */

function loadDNASequences() {

    const container =
        document.getElementById("dnaList");

    if (!container) return;

    container.innerHTML = "";

    const labels = [
        "Sequence A",
        "Sequence B",
        "Sequence C",
        "Sequence D"
    ];

    sequences.forEach((file, index) => {

        const block =
            document.createElement("div");

        block.className = "block collapsed";

        const button =
            document.createElement("button");

        button.className = "seqButton";

        const baseName =
            file.replace(".html", "");

        const label =
            labels[index % labels.length];

        button.textContent =
            `${baseName} — ${label}`;

        const content =
            document.createElement("div");

        content.className = "seqContent";

        const iframe =
            document.createElement("iframe");

        iframe.src = file;

        iframe.style.width = "100%";
        iframe.style.height = "350px";
        iframe.style.border = "1px solid white";

        content.appendChild(iframe);

        button.addEventListener("click", (e) => {

            e.stopPropagation();

            const isOpen =
                content.classList.contains("active");

            document.querySelectorAll("#dnaList .seqContent")
                .forEach(c => {
                    c.classList.remove("active");
                });

            document.querySelectorAll("#dnaList .block")
                .forEach(b => {
                    b.classList.remove("expanded");
                    b.classList.add("collapsed");
                });

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
   PHASE 2
========================= */

function checkPhase2() {

    playClick();

    const selected = Array.from(
        document.querySelectorAll(
            "#orgList input:checked"
        )
    ).map(el => el.value);

    const correct = [
        "V-03",
        "E-13",
        "H-07",
        "P-09"
    ];

    const success =
        selected.length === correct.length &&
        correct.every(v => selected.includes(v));

    const result =
        document.getElementById("phase2Result");

    result.textContent = success
        ? "SEQUENCE VALIDATED"
        : "INVALID VECTOR COMBINATION";

    if (!success) return;

    document.getElementById("phase2Access")
        .style.display = "block";

    triggerReboot();

}

/* =========================
   REBOOT
========================= */

function triggerReboot() {

    stage = 4;

    bootState = "phase3";

    rebootSound.pause();

    rebootSound.currentTime = 0;

    rebootSound.play().catch(() => {});

    showScreen("bootScreen");

    document.body.classList.add("glitch");

    setTimeout(() => {

        document.body.classList.remove("glitch");

        showScreen("phase3Screen");

    }, 7000);

}

/* =========================
   PHASE 3 MENU
========================= */

function openPhase3Tab(tabId) {

    playClick();

    const menuGrid =
        document.querySelector("#phase3Screen .menuGrid");

    if (menuGrid) {
        menuGrid.style.display = "none";
    }

    document.querySelectorAll(
        "#phase3Screen .tabContent"
    ).forEach(t => {
        t.classList.remove("activeTab");
    });

    const target =
        document.getElementById(tabId);

    if (target) {
        target.classList.add("activeTab");
    }

}

function closePhase3() {

    playClick();

    document.querySelectorAll(
        "#phase3Screen .tabContent"
    ).forEach(t => {
        t.classList.remove("activeTab");
    });

    const menuGrid =
        document.querySelector("#phase3Screen .menuGrid");

    if (menuGrid) {
        menuGrid.style.display = "flex";
    }

}

/* =========================
   SIMULATION
========================= */

function runSimulation() {

    playClick();

    const pathway =
        document.getElementById("pathwaySelect").value;

    const atp =
        document.getElementById("atpSelect").value;

    const mutation =
        document.getElementById("mutationSelect").value;

    const bacteria =
        document.getElementById("bacteriaCell");

    const virus =
        document.getElementById("virusParticle");

    const result =
        document.getElementById("simulationResult");

    const atpBar =
        document.getElementById("atpBarInner");

    const atpValue =
        document.getElementById("atpValue");

    bacteria.className = "";

    virus.className = "";

    result.textContent =
        "Injecting viral strain...";

    atpBar.style.width = "0%";

    atpValue.textContent = "0 ATP";

    virus.classList.add("injecting");

    setTimeout(() => {

        /* FAILURE */

        if (
            pathway === "electron" &&
            atp === "extreme"
        ) {

            bacteria.classList.add("deadCell");

            atpBar.style.width = "100%";

            atpValue.textContent =
                "ATP OVERLOAD";

            result.textContent =
                "Sample destroyed. ATP exceeded viable range.";

            return;
        }

        /* FAILED MUTATION */

        if (
            mutation === "repair" &&
            atp === "elevated"
        ) {

            bacteria.classList.add("failedMutation");

            atpBar.style.width = "45%";

            atpValue.textContent =
                "45 ATP";

            result.textContent =
                "Mutation unstable. No sustained adaptation detected.";

            return;
        }

        /* SUCCESS */

        if (
            pathway === "krebs" &&
            atp === "elevated" &&
            mutation === "enzyme"
        ) {

            bacteria.classList.add("mutatedCell");

            atpBar.style.width = "78%";

            atpValue.textContent =
                "78 ATP";

            result.textContent =
                "Stable mutation achieved. Sustained ATP amplification confirmed.";

            return;
        }

        /* DEFAULT */

        bacteria.classList.add("stableCell");

        atpBar.style.width = "30%";

        atpValue.textContent =
            "30 ATP";

        result.textContent =
            "No major mutation observed.";

    }, 1800);

}
