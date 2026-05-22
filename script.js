let stage = 0;

const clickSound = new Audio("click.mp3");

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

function playClick(){
    clickSound.currentTime = 0;
    clickSound.play();
}

function handleStart(){

    // START SCREEN
    if(stage === 0){

        playClick();

        document.getElementById("startScreen")
        .classList.remove("active");

        document.getElementById("bootScreen")
        .classList.add("active");

        document.getElementById("bootAudio").play();

        stage = 1;

        setTimeout(() => {

            document.getElementById("bootScreen")
            .classList.remove("active");

            document.getElementById("continueScreen")
            .classList.add("active");

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

function openTab(tabId){

    playClick();

    document.querySelectorAll(".tabContent")
    .forEach(tab => {
        tab.classList.remove("activeTab");
    });

    document.getElementById(tabId)
    .classList.add("activeTab");
}

function revealVideo(){

    playClick();

    document.getElementById("videoContainer")
    .style.display = "block";

    document.getElementById("revealButton")
    .style.display = "none";
}

function checkPassword(){

    playClick();

    const values = [
        document.getElementById("box1").value.trim().toUpperCase(),
        document.getElementById("box2").value.trim().toUpperCase(),
        document.getElementById("box3").value.trim().toUpperCase(),
        document.getElementById("box4").value.trim().toUpperCase()
    ];

    const correct = ["V-03","E-13","H-07","P-09"];

    const success = correct.every(code => values.includes(code));

    if(success){

        document.getElementById("passwordResult")
        .innerHTML = "ACCESS GRANTED";

    } else {

        document.getElementById("passwordResult")
        .innerHTML = "ACCESS DENIED";
    }
}
