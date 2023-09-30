const firstInput = document.getElementById("hours");
const secInput = document.getElementById("minutes");
const thirdInput = document.getElementById("seconds");
let obj = {};
let id = 0;

// deleting timers
function del(ele){
    const parent = ele.parentNode;
    const p = document.querySelector("main > p");
    const main = document.querySelector("main");
    parent.remove();
    const eleId = ele.previousElementSibling.id;
    delete obj[eleId];
    if(main.children.length === 2){
        p.style.display = "block";
    }
}

// adding timers
const set = document.getElementById("set");
set.addEventListener("click",()=>{
    let hrs = firstInput.value;
    let mins = secInput.value;
    let sec = thirdInput.value;
    if(Number(sec)<0 || Number(mins)<0 || Number(hrs)<0){
        alert("Please enter valid input");
        firstInput.value = "";
        secInput.value = "";
        thirdInput.value = "";
        return;
    }
    if(Number(sec) >= 60){
        alert("please enter input less than 60");
        firstInput.value = "";
        secInput.value = "";
        thirdInput.value = "";
        return;
    }
    if(Number(mins) >= 60){
        alert("please enter input less than 60");
        firstInput.value = "";
        secInput.value = "";
        thirdInput.value = "";
        return;
    }
    if(Number(hrs) < 10){
        hrs = "0"+hrs;
    }
    if(Number(mins) < 10){
        mins = "0"+mins;
    }
    if(Number(sec) < 10){
        sec = "0"+sec;
    }
    const main = document.querySelector("main");
    const p = document.querySelector("main > p");
    p.style.display = "none";
    const div = document.createElement("div");
    div.className = "timer";
    div.innerHTML = `
    <p>Time Left :</p>
    <div id=${++id} style="display:flex;"><p id="hrs${id}">${hrs}</p><span>:</span><p id="mins${id}">${mins}</p><span>:</span><p id="sec${id}">${sec}<p></div>
    <button onclick="del(this)">Delete</button>
    `;
    obj[id] = div;         // adding each timer to obj object  
    main.appendChild(div); 
    setTimer(id);          // setting set interval for each timer
    firstInput.value = "";
    secInput.value = "";
    thirdInput.value = ""; 
});


  


// set interval function
function setTimer(num){
    let sel = document.getElementById(num);
    let selectedDiv = sel.parentNode; 
    let selHours = document.getElementById(`hrs${num}`);
    let selMinutes = document.getElementById(`mins${num}`);
    let selSeconds = document.getElementById(`sec${num}`);

    let audio = new Audio("./music/iphone.mp3"); // Create a new audio element for each timer
    audio.loop = true; // Ensure the audio loops
    let soundPlaying = false;
    
    let timerId = setInterval(function () {
        let HH = parseInt(selHours.innerText, 10);
        let MM = parseInt(selMinutes.innerText, 10);
        let SS = parseInt(selSeconds.innerText, 10);
    
        if (HH <= 0 && MM <= 0 && SS <= 0) {
          clearInterval(timerId);
          selectedDiv.className = "timer-up";
          selectedDiv.innerHTML = `
            <p></p>
            <p>Timer Is Up!</p>
            <button onclick="stopTimerAndSound(this, ${num},)">Stop</button>
          `;
          if (!soundPlaying) {
            audio.play();
            soundPlaying = true;
          }
    
          return;
        }
    
        if (SS > 0) {
          selSeconds.innerText = (SS - 1).toString().padStart(2, "0");
        } else {
          if (MM > 0) {
            selMinutes.innerText = (MM - 1).toString().padStart(2, "0");
            selSeconds.innerText = "59";
          } else {
            selHours.innerText = (HH - 1).toString().padStart(2, "0");
            selMinutes.innerText = "59";
            selSeconds.innerText = "59";
          }
        }
    }, 1000);
    // Associate the audio element with the timer in the obj object
    obj[num] = {
      timerElement: selectedDiv,
      audioElement: audio,
      timerId: timerId,
      soundPlaying: soundPlaying,
    };
}

// function to stop the alarm
function stopTimerAndSound(button, num) {
    const timerData = obj[num];
  
    if (timerData) {
      clearInterval(timerData.timerId); // Clear the timer interval
      const timerElement = timerData.timerElement;
      timerElement.remove(); // Remove the timer element from the DOM
      delete obj[num]; // Remove the timer from the object

      timerData.audioElement.pause();           // Stop the associated audio element
      timerData.audioElement.currentTime = 0;   // Reset sound to the beginning
    //   timerData.audioElement.onended = null;    // Remove the onended event handler
    
      // Check if there are no timers left and display the "No timers" message if needed
      const main = document.querySelector("main");
      const p = document.querySelector("main > p");
      if (main.children.length === 2) {
        p.style.display = "block";
      }
    }
}