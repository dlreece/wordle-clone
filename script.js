import {WORDS} from "./words.js";

const TOTAL_GUESSES = 6;
let remainingGuesses = TOTAL_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let correctAnswer = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(correctAnswer)

// initialnize game board
function initBoard() {
    let board = document.getElementById("game-board");

    for(let i = 0; i < TOTAL_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for(let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }
        board.appendChild(row)
    }
}


// get user input:
document.addEventListener("keyup", e => {
    if (remainingGuesses === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }
    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    }else {
        insertLetter(pressedKey)
    }
})

function insertLetter(pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - remainingGuesses]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter ++
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - remainingGuesses]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter --
}


// check guess after you press enter
function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - remainingGuesses]
    let guessString = ''
    let correct = Array.from(correctAnswer)
    
    for(const val of currentGuess) {
        guessString += val
    }
    // make sure guess is 5 letters
    if(guessString.length != 5){
        toastr.error("Not enough letters!")
        return
    }
    //make sure guess is on list
    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    //check each letter of the word and shade them
    for(let i = 0; i < 5; i++){
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        //check if letter is in the correct word
        let letterPosition = correct.indexOf(currentGuess[i])
        
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === correct[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }
            correct[letterPosition] = '#'
        }
        //coloring boxes progessively from left to right
        let delay = 250 * i
        setTimeout(() => {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    //return results
    if (guessString === correctAnswer) {
        toastr.success("You guessed right! Game over!")
        remainingGuesses = 0
        return
    } else {
        remainingGuesses --
        currentGuess = []
        nextLetter = 0

        if (remainingGuesses === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${correctAnswer}"`)
        }
    }
}

function shadeKeyBoard(letter, color) {
    for(const elem of document.getElementsByClassName("keyboard-button")) {
        // find the key that matches the given letter
        if(elem.textContent === letter){
            let oldColor = elem.style.backgroundColor
            //if key is green do nothing
            if(oldColor === 'green'){
                return
            }
            //if key is yellow, only allow it to turn green
            if (oldColor === 'yellow' && color !== 'green') {
                return
            }
            //else shade the key passed to the function
            elem.style.backgroundColor = color
            break
        }
    }
}


//add keyboard clicks input:
// listens for a click on the keyboard container or any of its children
document.getElementById("keyboard-cont").addEventListener('click', (e) => {
    const target = e.target
    // If the clicked element was not a button, we exit
    if(!target.classList.contains("keyboard-button")) {
        return
    }

    let key = target.textContent
    if (key === "Del") {
        key = "Backspace"
    }
    // Else, we dispatch a key up event corresponding to the clicked key.
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})


//animation from Animate.css:
const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

initBoard()