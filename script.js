let stage = 0;

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

function handleStart(){

    // START SCREEN
    if(stage === 0){

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

        document.getElementById("continueScreen")
        .classList.remove("active");

        document.getElementById("menuScreen")
        .classList.add("active");

        stage = 2;
    }
}

function openTab(tabId){

    document.querySelectorAll(".tabContent")
    .forEach(tab => {
        tab.classList.remove("activeTab");
    });

    document.getElementById(tabId)
    .classList.add("activeTab");
}

function checkPassword(){

    const b1 = document.getElementById("box1").value.trim();
    const b2 = document.getElementById("box2").value.trim();
    const b3 = document.getElementById("box3").value.trim();
    const b4 = document.getElementById("box4").value.trim();

    if(
        b1 === "V-03" &&
        b2 === "E-13" &&
        b3 === "H-07" &&
        b4 === "P-09"
    ){

        document.getElementById("passwordResult")
        .innerHTML = "ACCESS GRANTED";

    } else {

        document.getElementById("passwordResult")
        .innerHTML = "ACCESS DENIED";
    }
}
