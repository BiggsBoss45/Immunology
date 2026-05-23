let stage = 0;

const clickSound = new Audio("click.mp3");

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

function playClick(){

    clickSound.currentTime = 0;
    clickSound.play();
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

            // FORCE reflow trick so animation always triggers
            el.style.transition = "none";
            el.style.strokeDashoffset = "1000";
            el.style.opacity = "0";

            // re-enable transition for next boot cycle
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

    // START SCREEN
    if(stage === 0){

        playClick();

        document.getElementById("startScreen")
        .classList.remove("active");

        document.getElementById("bootScreen")
        .classList.add("active");

        // BOOT AUDIO (clean single version)
        const bootAudio = document.getElementById("bootAudio");
        bootAudio.currentTime = 0;
        bootAudio.play();

        // start vector drawing slightly after audio begins
        setTimeout(() => {
            initVectorLines();
        }, 300);

        stage = 1;

        // end boot sequence
        setTimeout(() => {

            destroyVector();

            setTimeout(() => {

                document.getElementById("bootScreen")
                .classList.remove("active");

                document.getElementById("continueScreen")
                .classList.add("active");

            }, 1200);

        }, 7000);
    }

    // CONTINUE SCREEN
    else if(stage === 1){

        playClick();

        document.getElementById("continueScreen")
        .classList.remove("active");

        document.getElementById("menuScreen")
        .classList.add("active");

        stage = 2;
    }
}

/* =========================
   MENU SYSTEM
========================= */

function openTab(tabId){

    playClick();

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

        document.getElementById("box1")
        .value.trim().toUpperCase(),

        document.getElementById("box2")
        .value.trim().toUpperCase(),

        document.getElementById("box3")
        .value.trim().toUpperCase(),

        document.getElementById("box4")
        .value.trim().toUpperCase()
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

    if(success){

        document.getElementById("passwordResult")
        .innerHTML = "ACCESS GRANTED";

    } else {

        document.getElementById("passwordResult")
        .innerHTML = "ACCESS DENIED";
    }
}
