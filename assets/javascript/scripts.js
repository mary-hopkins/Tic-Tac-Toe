
let display = document.querySelector(".display-cell");
// Message to Player
function consoleLog(message) {
  display.textContent = message;
}

function gameMaster(player1, player2) {
  
  console.log(`${player1.name} and ${player2.name}`);
  let board_cell =  document.querySelector(".board-cell");
  let turn_counter = 1;
  let gameOn = true;
  let player_mark = "X";
  let xCubes = [];
  let oCubes = [];
  let startbtn = document.querySelector(".start-btn");
  //changes start btn to restart btn
  function restartBtn() {
    startbtn.innerHTML = "Restart";
    function restartGame() {
      location.reload();
    }
    startbtn.addEventListener("click", restartGame)
  }

  // updates players mark
  function whoseTurn() {
    if (turn_counter % 2 == 1) {
      player_mark = "X"
    } else {
      player_mark = "O"
    }
  }
  
  function endGame(type) {
    if(type == "scratch") {
      consoleLog("Nobody Won... :( ");
    } else if(type == "victory") {
      turn_counter ++;
      whoseTurn();
      if (player_mark == "X") {
      consoleLog(`Congrats ${player1.name}, sorry ${player2.name}`);
      } else {
        consoleLog(`Congrats ${player2.name}`)
      }
    } else {}
    board_cell.removeEventListener("click", mark);
  }
  //check for victory conditions
  function checkWin() {
    const wins = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
                  [1, 4, 7], [2, 5, 8], [3, 6, 9],
                  [1, 5, 9], [3, 5, 7]]

    // Creates array from board
    function readBoard() {
      var marker_array = ["p"];
      let cells = document.querySelectorAll('.cell');
      for (var i = 0; i < cells.length; i++) {
        let post = cells[i].textContent;
        marker_array.push(post);
      }
      if (marker_array.includes("")) {
        return marker_array;
      } else {
        endGame("scratch");
        return marker_array;
      }
       
    } 
    
    function transcribeArray(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == "X") {
          xCubes.push(i);
        } else if (array[i] == "O") {
          oCubes.push(i);
        } else {}
      }   
    }
    
    function testFor(array) {
      for (var w = 0; w < wins.length; w++) {
        let checker = (arr, target) => target.every(v => arr.includes(v));
        if (checker(array, wins[w]) == true) {
          endGame("victory");
        } else {
          
        }
        
      }
    }

    //// END READBOARD
    transcribeArray(readBoard()); // returns marker_array
    console.log(xCubes);
    console.log(oCubes);
    testFor(xCubes);
    testFor(oCubes);
    xCubes = [];
    oCubes = [];
    

  }


  // Place a mark on the board
  function mark(e) {
    if (e.target.textContent == "") {
      e.target.textContent = player_mark;
    } else {
      e.target.removeEventListener('click', mark);
    }
    turn_counter ++;
    whoseTurn();
    checkWin();
  }

  // Adds listener to board
  function addEventListener() { 
    board_cell.addEventListener("click", mark);  
  }

  // Creates board from array
  function populateDom(array) {
    board_cell.innerHTML = "";
    array.forEach((item) => {
        let square = document.createElement('div');
          square.classList.add("cell");
          square.textContent = item;
          board_cell.appendChild(square);
    })
    addEventListener();
  }

  

  // Makes "empty" array for startup
  function startingBoard() {
    var empty_array = []
    for (var i = 0; i < 9; i++) {
      empty_array.push("");
    } 
    populateDom(empty_array);
    
  }

  ///////////////////////// Functions called on start
   
  consoleLog(`${player1.name} and ${player2.name}`);
  startingBoard();
  restartBtn();
  
  
}

// Setup call from load
function warmUp() { 
  let playerCounter = 0; 
  let first_player = "";
  let second_player = "";
  // Player input  start
    function playerInput(player) {
      // creator factory --> start
      const PlayerCreator = (name, marker) => {

        // standby start
        function readyPlayer(player) {
          function checkEngines() {
            playerCounter ++;
            if (playerCounter >= 2) {
              let startbtn = document.querySelector(".start-btn");
              consoleLog("Please press START");
              function startGame(){
                gameMaster(first_player, second_player);
                startbtn.removeEventListener("click", startGame );
              }
              startbtn.addEventListener("click", startGame, false);
            } else {}
          } 
          function switchToCard(player) {
            if (player.marker == "X") {
              let form1 = document.querySelector(".form1");
              form1.classList.add("hidden");
              let card1 = document.querySelector(".card1");
              let card1name = document.querySelector(".playername1");
              card1name.textContent = player.name;
              card1.classList.remove("hidden");
            } else if (player.marker == "O") {
              let form2 = document.querySelector(".form2");
              form2.classList.add("hidden");
              let card2 = document.querySelector(".card2");
              let card2name = document.querySelector(".playername2");
              card2name.textContent = player.name;
              card2.classList.remove("hidden");
            }
            return player; 
          }
          if (player.marker == "X") {
            consoleLog(`Hello ${player.name}! Your marker is ${player.marker}`);
            let player_one = player;
            switchToCard(player_one);
            checkEngines();
          } else if (player.marker == "O") {
            consoleLog(`Hello ${player.name}! Your marker is ${player.marker}`)
            let player_two = player;
            switchToCard(player_two);
            checkEngines();
          } else {}
        };
        
        let pl = {name, marker};

        //standby end
        if (marker == "X") {
          first_player = pl;
          readyPlayer(pl);
        } else if (marker == "O") {
          second_player = pl;
          readyPlayer(pl);
        } else {}
        return pl;
      }
      // creator factory --> end
      let one_name = document.querySelector("#play1").value;
      let two_name = document.querySelector("#play2").value;
      if (player == "player 1") {
        PlayerCreator(one_name, "X");    
      } else if (player == "player 2" && two_name !== "") {
        PlayerCreator(two_name, "O");
      } else {console.log("Will be for AI")}
    }
    
  //player input end
  function onLoad() {
    let play1_confirm = document.querySelector("#play1confirm");
    play1_confirm.addEventListener("click", function(){
      playerInput("player 1");
    }, false);
    let play2_confirm = document.querySelector("#play2confirm");
    play2_confirm.addEventListener("click", function(){
      playerInput("player 2");
    }, false);
  }
  onLoad();
}


//////////////////////////////////////////////////////////////////////////////


// Page Load --> confirm buttons
window.onload = function() {
  warmUp();
};
