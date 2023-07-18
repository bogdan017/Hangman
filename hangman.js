const alphabet = document.getElementById("alphabet");
const gameOptions = document.getElementById("option");
const userGuess = document.getElementById("userGuess");
const newGame = document.getElementById("buttons");
const reset = document.getElementById("reset");
const winMessage = document.getElementById("result");
const canvas = document.getElementById("hangman");
const context = canvas.getContext("2d");
const lives = document.getElementById("lives");
const hint = document.getElementById("hint");
const hintButton = document.getElementById("hintButton");
hint.disabled = true;


let options = {
  fruits: [
    { word: "Apple", hint: "It has a red color" },
    { word: "Blueberry", hint: "It is small and blue" },
    { word: "Pineapple", hint: "House of Spongebob" }
  ],
  animals: [
    { word: "Squirrel", hint: "Small with a big tail" },
    { word: "Zebra", hint: "Has stripes" },
    { word: "Dog", hint: "Your favorite animal" }
  ],
  countries: [
    { word: "Romania", hint: "Has the longest part of the Danube" },
    { word: "Germany", hint: "Started two world wars" },
    { word: "Switzerland", hint: "The bank of Europe" }
  ]
};


let maxLives = 7; // maximum lives
let remainingLives = 0; // remaining lives in the initializeGame() function
let chosenWord = ""; // the word that was randomly chosen
let wordHint = ""; // the hint for the chosen word 
let winLetters = 0; // it increments when a correct letter is clicked
let loseLetters = 0;// it increments when an incorrect letter is clicked
let wordAlreadyChosen = false; //flag used for choosing a single word per selected category in the current game


displayLives(remainingLives);

function hideElements() {
  alphabet.classList.add("hide");
  gameOptions.classList.add("hide");
  userGuess.classList.add("hide");
  canvas.style.visibility = "hidden";
  lives.classList.add("hide");
  hint.classList.add("hide");
  hintButton.classList.add("hide");
}

//display game options
function displayGameOptions() {
  gameOptions.innerHTML += `<h3>Please select an option</h3>`;
  let optButton = document.createElement("div");
  for (let optValue in options) {
    optButton.innerHTML += `<button class="options" onclick="generateWord('${optValue}')">${optValue}</button>`;
  }
  gameOptions.appendChild(optButton);
  alphabet.classList.add("hide");
}

//get a random word
function getRandomWord(array) {
  return array[Math.floor(Math.random() * array.length)];
}

//generate the word and replace it with dashes
function generateWord(option) {
  let optButtons = document.querySelectorAll(".options");

  for (let btn of optButtons) {
    if(btn.innerText.toLowerCase() === option.toLowerCase()) {
      btn.classList.add("active");
    } else {
      btn.classList.add("disabled");
      btn.disabled = true;
    }
  }

  if(wordAlreadyChosen) {
    return;
  }

  let optionArray = options[option];
  let chosenOption = getRandomWord(optionArray);
  chosenWord = chosenOption.word.toUpperCase();
  wordHint = chosenOption.hint;


  let displayLetter = chosenWord.replace(/./g, '<span class="replace"> _</span>');
  alphabet.classList.remove("hide");
  userGuess.innerHTML = displayLetter;

  hintButton.disabled = false;

  wordAlreadyChosen = true;
}


function generateLetters() {
  let btnLetters = "";
  for(let i = 65; i < 91; i++) {
    let letter = String.fromCharCode(i);
    btnLetters += letter;
  }
  let alphabetList = btnLetters.split('');
  return alphabetList;
}

function generateButtons() {
  let letters = generateLetters();
  let lettersArray = [];

  for (let letter of letters) {
    lettersArray.push(`<button class="btn btn-lg btn-primary m-1 text-center" id="${letter}">${letter}</button>`);
  }

  alphabet.innerHTML = lettersArray.join('');
}

gameOptions.addEventListener("click", function(event){
  const optButton = event.target;
  if(optButton === "BUTTON") {
    generateButtons();
  }
});


function initializeGame() {
  reset.classList.add("hide");

  alphabet.addEventListener("click", function(event) {
    let clickedButton = event.target;
    if (clickedButton.nodeName === "BUTTON" && !clickedButton.disabled) {
      let clickedLetter = clickedButton.innerText;
      let dashes = document.getElementsByClassName("replace");

      if (chosenWord.split('').includes(clickedLetter)) {
        console.log(chosenWord);
        for (let i = 0; i < chosenWord.length; i++) {
          let char = chosenWord[i];
          if (char === clickedLetter) {
            dashes[i].innerText = char;
            ++winLetters;
          }
          console.log(winLetters);
          console.log(chosenWord.length);

          if (winLetters === chosenWord.length) {
            hideElements();
            winMessage.innerHTML = `<h2>You won!</h2><p>The word was <span>${chosenWord}</span></p>`;
            reset.classList.remove("hide");
          }
        }
      } else {
        loseLetters++;
        drawHangman(loseLetters);
        maxLives--;
        remainingLives = maxLives;
        displayLives(remainingLives);
        if (remainingLives === 0) {
          hideElements();
          winMessage.innerHTML = `<h2>You lost!</h2><p>The word was <span>${chosenWord}</span></p>`;
          reset.classList.remove("hide");
        }
      }

      clickedButton.disabled = true; 
    }
  });
}

function displayLives(life) {
  if (life > 0) {
    lives.innerHTML = `You have ${life} ${life === 1 ? "life" : "lives"} left!`;
  } else {
    lives.innerHTML = "";
  }
}

function displayHint(hintOption) {
  hint.innerHTML += `<p><strong>${hintOption}</strong></p>`;
}


hintButton.addEventListener("click", function(){

  if(chosenWord) {
    displayHint(wordHint);
    hintButton.disabled = true;
  }
});

function drawHangman(bodyPart) {
  switch(bodyPart) {
    case 1: //frame
      context.beginPath();
      context.moveTo(180, 250);
      context.lineTo(50, 250);
      context.moveTo(80,250);
      context.lineTo(60,20);
      context.moveTo(60,20);
      context.lineTo(140,20);
      context.moveTo(140,20);
      context.lineTo(140,45);
      context.stroke();
      break;

    case 2: //head
      context.beginPath();
      context.arc(140,70,25,0,2*Math.PI);
      context.closePath();
      context.stroke();
      break;

    case 3: //body
      context.beginPath();
      context.moveTo(140,95);
      context.lineTo(140,180);
      context.stroke();
      break;

    case 4: //left arm
      context.beginPath();
      context.moveTo(140,110);
      context.lineTo(110,140);
      context.stroke();
      break;

    case 5: //right arm
      context.beginPath();
      context.moveTo(140,110);
      context.lineTo(170,140);
      context.stroke(); 
      break;

    case 6: //left leg
      context.beginPath();
      context.moveTo(140,180);
      context.lineTo(110,210);
      context.stroke();
      break;

    case 7: //right leg
      context.beginPath();
      context.moveTo(140,180);
      context.lineTo(170,210);
      context.stroke();
      break;
    default: break;
  }
}



displayGameOptions();
generateButtons();
initializeGame();


function resetGame() {

  chosenWord = "";
  maxLives = 7;
  remainingLives = maxLives;
  userGuess.innerHTML = "";
  winMessage.innerHTML = "";
  hint.innerHTML = "";
  winLetters = 0;
  loseLetters = 0;
  wordAlreadyChosen = false;


  context.clearRect(0, 0, canvas.width, canvas.height);

  alphabet.classList.remove("hide");
  gameOptions.classList.remove("hide");
  userGuess.classList.remove("hide");
  lives.classList.remove("hide");
  hint.classList.remove("hide");
  hintButton.classList.remove("hide");
  reset.classList.add("hide");

  canvas.style.visibility = "visible";

  //canvas.style.border = "1px solid black";

  alphabet.classList.add("hide");

  const alphabetButtons = document.querySelectorAll("#alphabet button");
  for (let button of alphabetButtons) {
    button.disabled = false;
  }

  const optionButtons = document.querySelectorAll(".options");
  for (let button of optionButtons) {
    button.disabled = false;
    button.classList.remove("disabled");
  }

  displayLives(remainingLives);

  drawHangman(0);
}
