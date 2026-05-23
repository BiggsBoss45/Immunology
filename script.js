let stage = 0;
let bootState = "idle"; // idle → booting → continue → menu

const clickSound = new Audio("click.mp3");

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

function playClick(){

    clickSound.currentTime = 0;
    clickSound.play();
}

/* =========================
   VIDEO SAFETY CONTROL
========================= */

function stopVideoLog(){

    const video = document.querySelector("#videoContainer video");

    if(video){

        video.pause();
        video.currentTime = 0;
        video.muted = true;
    }
}

/* =========================
   BOOT VECTOR SYSTEM
========================= */

function initVectorLines(){

    const elements = document.querySelectorAll(".vline");

    const beatInterval = 700;

    elements.forEach((el, i) => {

        setTimeout(() => {

            el.style.opacity = "1";
            el.style.transition = "1.2s linear";
            el.style.strokeDashoffset = "0";

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

    if(bootState === "booting"){
        return;
    }

    // START SCREEN
    if(stage === 0){

        bootState = "booting";

        playClick();

        document.getElementById("startScreen")
        .classList.remove("active");

        document.getElementById("bootScreen")
        .classList.add("active");

        const bootAudio = document.getElementById("bootAudio");
        bootAudio.currentTime = 0;
        bootAudio.play();

        setTimeout(() => {
            initVectorLines();
        }, 300);

        stage = 1;

        setTimeout(() => {

            destroyVector();

            setTimeout(() => {

                document.getElementById("bootScreen")
                .classList.remove("active");

                document.getElementById("continueScreen")
                .classList.add("active");

                bootState = "continue";

            }, 1200);

        }, 7000);
    }

    // CONTINUE SCREEN
    else if(stage === 1 && bootState === "continue"){

        playClick();

        document.getElementById("continueScreen")
        .classList.remove("active");

        document.getElementById("menuScreen")
        .classList.add("active");

        stage = 2;
        bootState = "menu";
    }
}

/* =========================
   MENU SYSTEM
========================= */

function openTab(tabId){

    playClick();

    // STOP VIDEO WHEN SWITCHING TABS
    stopVideoLog();

    document.querySelector(".menuGrid")
    .style.display = "none";

    document.querySelectorAll(".tabContent")
    .forEach(tab => {
        tab.classList.remove("activeTab");
    });

    document.getElementById(tabId)
    .classList.add("activeTab");
}

function closeTabs(){

    playClick();

    // STOP VIDEO WHEN EXITING TABS
    stopVideoLog();

    document.querySelectorAll(".tabContent")
    .forEach(tab => {
        tab.classList.remove("activeTab");
    });

    document.querySelector(".menuGrid")
    .style.display = "flex";
}

/* =========================
   AUDIO LOG
========================= */

function revealVideo(){

    playClick();

    const video = document.querySelector("#videoContainer video");

    if(video){
        video.muted = false;
    }

    document.getElementById("videoContainer")
    .style.display = "block";

    document.getElementById("revealButton")
    .style.display = "none";
}

/* =========================
   PASSWORD SYSTEM
========================= */

function checkPassword(){

    playClick();

    const values = [
        document.getElementById("box1").value.trim().toUpperCase(),
        document.getElementById("box2").value.trim().toUpperCase(),
        document.getElementById("box3").value.trim().toUpperCase(),
        document.getElementById("box4").value.trim().toUpperCase()
    ];

    const correct = [
        "V-03",
        "E-13",
        "H-07",
        "P-09"
    ];

    const success = correct.every(code =>
        values.includes(code)
    );

    document.getElementById("passwordResult").innerHTML =
        success ? "ACCESS GRANTED" : "ACCESS DENIED";
}
