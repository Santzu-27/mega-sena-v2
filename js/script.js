var state = {board: [], currentGame: [], savedGames:[]}

function start(){
    readLocalStorage();
    createBoard();
    newGame();
        
}

function readLocalStorage(){
    if(!window.localStorage){
        return
    }
    
    var savedGamesFromLocalStorage = window.localStorage.getItem('saved_Games');

    if(savedGamesFromLocalStorage) {
        state.savedGames = JSON.parse(savedGamesFromLocalStorage);
    }
}

function writeToLocalStorage(){
    window.localStorage.setItem('saved_Games', JSON.stringify(state.savedGames))
}

start();

function createBoard(){
    state.board = [];
    for (var i = 1; i <= 60; i++){
        state.board.push(i);
    }
}

function newGame(){
    resetGame();
    render();
}

function render(){
    renderBoard();   
    renderButtons();
    renderSavedGames();
}

function renderBoard(){
    var divBoard = document.querySelector('#megasena-board')
    divBoard.innerHTML = '';

    var ulNumbers = document.createElement('ul');
    ulNumbers.classList.add('numbers');

    for (var i = 0; i < state.board.length; i++) {
        var currentNumber = state.board[i];

        

        var liNumber = document.createElement('li');
        liNumber.textContent = currentNumber;
        liNumber.classList.add('number');


        liNumber.addEventListener('click', handleNumberClick);

        if(isNumberInGame(Number(currentNumber))){
            liNumber.classList.add('selected_number');
        }

        ulNumbers.appendChild(liNumber);
    }

    divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event){
    var value = Number(event.currentTarget.textContent);

    if (isNumberInGame(value)){
        removeNumberFromGame(value);
    } else {
        addNumberToGame(value);
    }
    render()
}

function renderButtons(){
    var divButtons = document.querySelector('#megasena-buttons');
    divButtons.innerHTML = '';

    var buttonNewGame = createNewGameButton();
    var buttonRandomGame = createRandomGameButton();
    var buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonSaveGame);
    divButtons.appendChild(buttonNewGame);
    divButtons.appendChild(buttonRandomGame);
}

function createSaveGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Salvar Jogo';
    button.disabled = !isGameComplete();

    button.addEventListener('click', saveGame);

    return button;
}

function createRandomGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Jogo aleatório';

    button.addEventListener('click', randomGame);

    return button;
}

function createNewGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Novo Jogo';

    button.addEventListener('click', newGame);

    return button;
}

function renderSavedGames(){
    var divSavedGames = document.querySelector('#megasena-saved-games')
    divSavedGames.innerHTML = '';

    if(state.savedGames.length === 0){
        divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>'
    }else{
        var ulSavedGames = document.createElement('ul')

        for(var i = 0; i < state.savedGames.length; i++){
            var currentGame = state.savedGames[i]

            var liGame = document.createElement('li')

            var beforeLi = document.createElement('span')
            beforeLi.classList = 'game-number'

            var gameNumber =' 0' + i
            beforeLi.textContent = 'Jogo' + gameNumber

            
            
            liGame.textContent = /*currentGame.join*/(' >> ' + currentGame.join(', '));
            liGame.classList = 'numberList'
            
            liGame.insertBefore(beforeLi, liGame.firstChild)
            ulSavedGames.appendChild(liGame);
            
        }
        ulSavedGames.classList = 'ulList'
        divSavedGames.appendChild(ulSavedGames)
        
    }
}

function warningFull(){
    if(isGameComplete){
        window.alert('O jogo já esta completo')
    }
}

function addNumberToGame(numberToAdd){
    if (numberToAdd <1 || numberToAdd > 60){
        return;
    }

    if (state.currentGame.length >= 6){
        warningFull();
        return
    }

    state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove){
    var newGame = []

    for (var i = 0; i < state.currentGame.length; i++) {
        var currentNumber = state.currentGame[i]

        if (currentNumber === numberToRemove){
            continue
        }

        newGame.push(currentNumber);
    }
    state.currentGame = newGame;
}

function isNumberInGame(numberToCheck){
    /*if(state.currentGame.includes(numberToCheck)){
        return true;
    }

    return false;*/

    return state.currentGame.includes(numberToCheck)
}

function saveGame() {
    state.savedGames.push(state.currentGame);
    newGame()
    writeToLocalStorage();
}

function isGameComplete(){
    return state.currentGame.length === 6;
}

function resetGame(){
    state.currentGame = [];
}

function randomGame(){
    resetGame();

    while (!isGameComplete()){
        var randomNumber = Math.ceil(Math.random() * 60); 

        addNumberToGame(randomNumber)
    }          
    render()
}
