const emojis = ['😀', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '😉', '😊', '😇', '🤑', '🤐', '🥵', '🥶', '🤢',
    '😎', '🤓', '🧐', '😨', '😱']


let numberOfCards = 0;
let firstCard = null;
let secondCard = null;
let isBoardLocked = false;

function startGame(){
    const boardWidth = parseInt(document.getElementById('width').value);
    const boardHeight = parseInt(document.getElementById('height').value);

    if(isOutOfRange(boardWidth, 4, 11)){
        alert("Width must be from 4 to 11")
        return;
    }

    if(isOutOfRange(boardHeight, 3, 6)){
        alert("Height must be from 3 to 6")
        return;
    }

    reset();
    setupBoard(boardWidth, boardHeight);
}

function isOutOfRange(currentValue, minValue, maxValue){
    return currentValue < minValue || currentValue > maxValue;
}

function setupBoard(boardWidth, boardHeight){
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardWidth}, 100px)`;
    board.style.gridTemplateRows = `repeat(${boardHeight}, 100px)`;

    numberOfCards = boardWidth * boardHeight;
    const selectedEmojis = shuffleArray(emojis).slice(0, numberOfCards / 2);
    const doubleEmojis = [...selectedEmojis, ...selectedEmojis];

    if (numberOfCards % 2 === 1){
        doubleEmojis.push('');
    }

    const gameEmojis = shuffleArray(doubleEmojis);

    gameEmojis.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        card.appendChild(emojiElement);

        card.addEventListener('click', () => flipCard(card, emojiElement));

        board.appendChild(card);
    });
}

function shuffleArray(array){
    for(let i = array.length - 1; i > 0; i--){
       const j = Math.floor(Math.random() * (i + 1));
       [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function flipCard(card, emojiElement){
    if (isBoardLocked === true ||
            card === firstCard ||
                card.classList.contains('matched')){
        return;
    }

    card.classList.add('flipped');
    
    if(firstCard === null){
        firstCard = card;
    }
    else{
        secondCard = card;
        checkForMatch();
    }
}

function checkForMatch(){
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if(isMatch){
        disableCards();
    }
    else{
        unflipCards();
    }
}

function disableCards(){
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    const adjustedTotal = numberOfCards % 2 === 0 ? numberOfCards : numberOfCards - 1;

    if(document.querySelectorAll('.card.matched').length === adjustedTotal){
       setTimeout(() =>{
        alert("You win!")

       }, 1000) 
    }

    reset();
}

function unflipCards(){
    isBoardLocked = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        reset();
    }, 1000);
}

function reset(){
    [firstCard, secondCard] = [null, null];
    isBoardLocked = false;
}


document.getElementById('start-button').addEventListener('click', startGame)