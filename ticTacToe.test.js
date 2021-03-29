const Game = require('./scripts');

////////// Tests for Game Factory Function //////////
///// Testing for wins/scratches /////


///// Handle Player Action /////
test('handlePlayerAction() doesn"t accept an invalid move', () => {
    let testGame = Game('John', 'Doe');
    expect(testGame.handlePlayerAction(10)).toEqual(false);
});

test('handlePlayerAction(3) places a mark on the board on the second row, checks for win, updates player turn, board, mark', () => {
    let testGame = Game('John', 'Doe');
    testGame.handlePlayerAction(3);
    expect(testGame.getBoardAsArray()).toEqual(["", "", "", "X", "", "", "", "", ""]); // update game board 
    expect(testGame.getWinner()).toEqual("No End"); // checks for winner to change
    expect(testGame.getPlayerTurn()).toEqual("O"); // changes player turn
});


///// Getters and Setters /////
test('getPlayerName(num) returns playerOneName or playerTwoName depending on num', () => {
    let testGame = Game('John', 'Doe');
    expect(testGame.getPlayerName(1)).toEqual('John');
    expect(testGame.getPlayerName(2)).toEqual('Doe');
});
  
test('setPlayerOneName(name), changes playerOneName', () =>{
    let testGame = Game('John', 'Doe');
    testGame.setPlayerOneName('Jane');
    expect(testGame.getPlayerName(1)).toEqual('Jane');
});

test('setPlayerTwoName(name), changes playerTwoName', () =>{
    let testGame = Game('John', 'Doe');
    testGame.setPlayerTwoName('Smith');
    expect(testGame.getPlayerName(2)).toEqual('Smith');
});

test('getBoardAsArray() returns an array 9 elements long', () => {
    let testGame = Game('John', 'Doe');
    expect(testGame.getBoardAsArray()).toEqual(["", "", "", "", "", "", "", "", ""]);
});

test('getPlayerTurn returns an X on first round', () => {
    let testGame = Game('John', 'Doe');
    expect(testGame.getPlayerTurn()).toEqual("X");
});

test('getWinner should return "No End" on first round', () => {
    let testGame = Game('John', 'Doe');
    expect(testGame.getWinner()).toEqual("No End");
});