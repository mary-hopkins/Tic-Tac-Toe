/*
This file is broken up into a few sections: 
1. DOM declarations 
2. Utility Functions 
3. Event Listeners
4. DOM manipulation Functions
5. Game Logic
6. Program Hook stuffsS

On page load, game = Game("", "") is called to initialize an empty game.

The first half of this site is getting player name input. After this is completed, 
The first thing that happens after is buildGame is called, which creates the Player Name Forms and their confirmation buttons/listeners
When a player confirms their name, their button is disabled and we check to see if all players are confirmed
InitializeGame is called, which pulls name info and starts the game logic then deletes the forms/replaces them with cards.
Also draws the board, adds GameEventListeners
*/


////////// DOM Declarations /////////
let display = document.querySelector("#display");
let playerBlock = document.querySelector("#players"); 
let board_cell =  document.querySelector("#board-cell");

////////// Utility Functions //////////
// Handles calls to DOM manipulation and interfaces with Game Logic through object "game".

function buildGame() {
  createPlayerNameForms();
  drawGameBoard();
  addFormEventListeners();
}

function initializeGame() {
  switchPlayerFormsToCards();
  drawGameBoard();
  addCellEventListeners();
}

function confirmPlayerName(event) {
  // checks game to see if the name is already set
  let playerNumber = parseInt(event.target.dataset.player);
  if(game.getPlayerName(playerNumber) != "") {
    displayMessage("Name is already set");
    return false;
  }
  // sets the name
  if(playerNumber == 1) {
    let playerNameInput = document.querySelector('#playerone').value;
    if(playerNameInput != "") {
      game.setPlayerOneName(playerNameInput);
    } else {
      displayMessage("Please Enter A Name!");
      return false;
    }
  } else {
    let playerNameInput = document.querySelector('#playertwo').value;
    if(playerNameInput != "") {
      game.setPlayerTwoName(playerNameInput);
    } else {
      displayMessage("Please Enter A Name!");
      return false;
    }
  }
  // Disables button and then sends call to remove event listener
  event.target.setAttribute("disabled", "");
  removeFormEventListener(playerNumber);

  // Checks if it's time to start the game
  if((game.getPlayerName(1) != "") && game.getPlayerName(2) != "") {
    initializeGame();
  } 
}

function handlePlayerTurn(event) {
  let index = parseInt(event.target.dataset.index);
  if(!game.handlePlayerAction(index)) {
    displayMessage("That Was Not A Valid Move!");
  } else {
    if(game.getWinner() != "No End") {
      drawGameBoard();
      endTheGame(game.getWinner());
    } else {
      drawGameBoard();
      addCellEventListeners();
    }
  }
}

function endTheGame(type) {
  if(type == "scratch") {
    displayMessage("Nobody Won... :( ");
  } else if(type == "X") {
    displayMessage(`Congrats ${game.getPlayerName(1)}, sorry ${game.getPlayerName(2)}`);
  } else {
    displayMessage(`Congrats ${game.getPlayerName(2)}, sorry ${game.getPlayerName(1)}`);
  }
  removeCellListeners();
}

function restartTheGame() {
  location.reload();
  return false;
}


////////// Event Listeners //////////
// All Event Listeners have been contained to 4 functions
  // remove/addFormEventListeners for player name input forms
  // remove/addGameEventListeners for gameplay
  // Restart Button Event Listener is placed inside addRestartGameButton() <= DOM Manipulation

function addFormEventListeners() {
  let confirmPlayerOne = document.querySelector('[data-player="1"]');
  let confirmPlayerTwo = document.querySelector("[data-player='2']");
  
  confirmPlayerOne.addEventListener("click", confirmPlayerName, false);
  confirmPlayerTwo.addEventListener("click", confirmPlayerName, false);
}
function removeFormEventListener(playerNumber) {
  if(playerNumber == "1") {
    let confirmPlayerOne = document.querySelector('[data-player="1"]');
    confirmPlayerOne.removeEventListener("click", confirmPlayerName, false);
  } else {
    let confirmPlayerTwo = document.querySelector("[data-player='2']");
    confirmPlayerTwo.removeEventListener("click", confirmPlayerName, false);
  }
}

function addCellEventListeners() {
  let cells = document.querySelectorAll('.cell');
  for(let c = 0; c < cells.length; c ++) {
    let currentCellMarker = cells[c].textContent;
    if(currentCellMarker != "") {
      continue;
    } else {
      cells[c].addEventListener("click", handlePlayerTurn, false);
    }
    
  }
}
function removeCellListeners() {
  let cells = document.querySelectorAll('.cell');
  for(let c = 0; c < cells.length; c++) {
    cells[c].removeEventListener("click", handlePlayerTurn, false);
  }
}

////////// DOM manipulation Functions //////////

/// Player Block ///

function createPlayerNameForms() {
  let playerArray = [["Player One", "playerone", "confirmplayerone", "X"], ["Player Two", "playertwo", "confirmplayertwo", "O"]];
  for(let i = 0; i < 2; i++) {
    let playerDiv = document.createElement("div");
    playerDiv.classList.add("playerNameForm");
    playerBlock.appendChild(playerDiv);
    
    let playerTitle = document.createElement("h2");
    playerTitle.innerHTML = playerArray[i][0];
    playerDiv.appendChild(playerTitle);
    
    let playerNameLabel = document.createElement("label");
    playerNameLabel.setAttribute("for", playerArray[i][1]);
    playerNameLabel.innerText = "Name: ";
    playerDiv.appendChild(playerNameLabel);
    
    let playerNameInput = document.createElement("input");
    playerNameInput.setAttribute("type", "text");
    playerNameInput.setAttribute("name", playerArray[i][1]);
    playerNameInput.setAttribute("id", playerArray[i][1]);
    playerNameInput.setAttribute("required", "");
    playerDiv.appendChild(playerNameInput);
    
    let confirmPlayerNameButton = document.createElement("button");
    confirmPlayerNameButton.setAttribute("id", playerArray[i][2]);
    confirmPlayerNameButton.innerText = playerArray[i][3];
    confirmPlayerNameButton.setAttribute("data-player", (i + 1));
    playerDiv.appendChild(confirmPlayerNameButton);
    
    let confirmInstructions = document.createElement("p");
    confirmInstructions.innerText = "Press to Confirm";
    playerDiv.appendChild(confirmInstructions);
    
  }
}

function createPlayerCards() {
  let playersArray = [["cardone", "Player One", "X"], ["cardtwo", "Player Two", "O"]];
  for(let i = 0; i < 2; i++) {
    let playerCard = document.createElement("div");
    playerCard.setAttribute("class", "card");
    playerCard.setAttribute("id", playersArray[i][0]);
    playerBlock.appendChild(playerCard);
    
    let playerTitle = document.createElement("h2");
    playerTitle.innerText = playersArray[i][1];
    playerBlock.appendChild(playerTitle);
    
    let playerNameSlot = document.createElement("h3");
    playerNameSlot.innerText = game.getPlayerName(i + 1);
    playerBlock.appendChild(playerNameSlot);
    
    let playerMarkSlot = document.createElement("h3");
    playerMarkSlot.innerText = playersArray[i][2];
    playerBlock.appendChild(playerMarkSlot);
  }
}

function removeChildrenFromPlayersBlock() {
  while (playerBlock.firstChild) {
    playerBlock.removeChild(playerBlock.firstChild);
  }
  
}

function addRestartGameButton() { // Contains an Event Listener for reseting game
  let restartBtn = document.createElement("button");
  restartBtn.setAttribute("id", "restartBtn");
  restartBtn.innerText = "Restart";
  playerBlock.appendChild(restartBtn);

  let restartbtn = document.querySelector("#restartBtn");
  restartbtn.addEventListener("click", restartTheGame);
}

function switchPlayerFormsToCards () {
  removeChildrenFromPlayersBlock();
  createPlayerCards();
  addRestartGameButton();
}

/// Board Block ///

function drawGameBoard() {
  let arrayOfMarks = game.getBoardAsArray();
  board_cell.innerHTML = "";
  for(let i = 0; i < 9; i++) {
    let square = document.createElement('div');
    square.classList.add("cell");
    square.textContent = arrayOfMarks[i];
    square.setAttribute("data-index", i);
    board_cell.appendChild(square);
  }
}

/// Message Block ///
function displayMessage(message) {
  display.textContent = message;
}

////////// Game Logic //////////

const Game = (
  playerOneName,
  playerTwoName,
  boardAsArray = ["", "", "", "", "", "", "", "", ""],
  playerTurn = "X",
  turnCounter = 0,
  winner = "No End",
  wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]]
  
  ) => {
    
  // Return values to be used by UI
  const getPlayerTurn = () => playerTurn;
  const getBoardAsArray = () => boardAsArray;
  const getPlayerName = function(number) {
    if(number == 1) {
      return playerOneName;
    } else {
      return playerTwoName;
    }
  }
  const getWinner = () => winner;
  function setPlayerOneName (name) {
    playerOneName = name;
  } 
  function setPlayerTwoName(name) {
    playerTwoName = name;
  }
  
  // The following few functions handle most of the game logic.
  // handlePlayerAction receives index of value to change, validates if that index is empty. 
      //Calls updateGameboard, which changes the value in the array.
      //Calls checkForEndOfGame, which makes arrays of X indexes and O indexes.
          //Calls compareToWinCases which does that and returns true/false.
      //Updates winner variable if there is a winner.
  //Returns true if a valid move has been made.
  ///Calling function(handlePlayerTurn) handles dispensing victory parade.
  function handlePlayerAction(index) {
      if(boardAsArray[index] == "") {
        updateGameBoard(index, playerTurn);
        checkForEndOfGame();
        updatePlayerTurn();
        return true;
      } else {
        return false;
    }
  }

  function checkForEndOfGame() {
    let xCells = [];
    let oCells = [];
    for(let i = 0; i < boardAsArray.length; i++) {
      if(boardAsArray[i] == "X") {
        xCells.push(i);
      } else if(boardAsArray[i] == "O") {
        oCells.push(i);
      } 
    }
    if(compareToWinCases(xCells)) {
      winner = "X";
    } else if(compareToWinCases(oCells)) {
      winner = "O"
    } else if(turnCounter >= 7) {
      winner = "scratch";
    }
  }

  function compareToWinCases(array) {
    for(let j = 0; j < wins.length; j ++) {
      if(wins[j].every((val) => array.includes(val))) {
        return true;
      }
      continue;
    }
    return false;
  }

  function updateGameBoard(index, mark) {
    boardAsArray[index] = mark;
  }
  function updatePlayerTurn(mark) {
    if(playerTurn == "X") {
      playerTurn = "O";
    } else {
      playerTurn = "X";
    }
    turnCounter++;
  }
  
  return {
    getPlayerName,
    getBoardAsArray,
    getPlayerTurn,
    getWinner,
    setPlayerOneName,
    setPlayerTwoName,
    handlePlayerAction
  };

};

let game = Game("", "");

////////// Page Load //////////
window.onload = function() {
  buildGame();
};