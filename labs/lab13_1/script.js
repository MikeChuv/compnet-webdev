

let quiz;
let currentQuestion = 0;
let score = 0;
let askingQuestion = true;

const quizTimeout  = 30 * 1000;
let quizTimeoutObj;

let tickCounter    = 0;
const tickInterval = 1000;
let intervalObj;

const quizDataFilename  = "./data.json";

const radioBtnClass     = "radio-button"
const quizItemSpanClass = "quiz-item-span"
const quizBlockNameId   = "quiz-content";

const questionText      = "Вопрос";
const submitAnswerText  = "Ответить";
const nextQuestionText  = "Следующий вопрос";
const finishText        = "Завершить тест"
const correctTag        = "<h3>Верно!</h3>";
const incorrectTag      = "<h3>Неверно!</h3>";


function ms2HMSMs(milliseconds){
    seconds      = milliseconds / 1000;
    milliseconds = milliseconds % 1000;      // remaining
    minutes      = seconds / 60;
    seconds      = Math.floor(seconds % 60); // remaining
    hours        = Math.floor(minutes / 60);
    minutes      = Math.floor(minutes % 60); // remaining
    return `${hours} : ${minutes} : ${seconds} :  ${milliseconds}`;
}


function showTime(){
    const clockDisplay = document.getElementById("clock");
    const pbar = document.getElementById("progressbar");
    tickCounter++;
    let rem = (quizTimeout - tickCounter * tickInterval);
    let text = `Осталось времени: ${ms2HMSMs(rem)}`;
    clockDisplay.textContent = text;
    pbar.style.width = Math.round((tickCounter * tickInterval) * 100 / quizTimeout) + "%";
}




function getQuestion(text, idx){
    return `${questionText} ${idx + 1}: ${text}`

}

function createRadioButton(id, value){
    let radioButton  = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'quiz';
    radioButton.id = id;
    radioButton.value = value;
    radioButton.classList.add(radioBtnClass)
    return radioButton
}

function getProgressTag(score, len){
    return `<p>Результат: ${score} правильных ответов из ${len}</p>`;
}


function getResult(score, len){
    let result = '<div class="quiz-result">Тест окончен</div><p>Ваш результат:</p>';
    result += `<div class="quiz-result"> ${score} из ${len} вопросов, ${Math.round(score/len * 100)}%</div>`;
    return result;
}

function createQuizTimeout(){
    return setTimeout(() => {
        showFinalResults()
    }, quizTimeout)
}


function loadQuestion(){
    
    document.getElementById(quizBlockNameId).innerHTML = "";
    
    for(let i = 0; i < quiz[currentQuestion]["choices"].length; i++){
       
        const choiceId = 'choice' + (i + 1);
        const choiceText = quiz[currentQuestion]["choices"][i];

        let label = document.createElement('label');
        label.setAttribute('for', choiceId);

        let radioButton = createRadioButton(
            choiceId, 
            choiceText
        )
        
        let span = document.createElement('span');
        span.setAttribute('for', choiceId);
        span.classList.add(quizItemSpanClass)
        span.innerHTML = choiceText;

        label.appendChild(span);
        label.insertBefore(radioButton, span);
        
        const br = document.createElement('br');
        
        let contentEl = document.getElementById(quizBlockNameId);
        contentEl.appendChild(br);
        document.getElementById(quizBlockNameId).insertBefore(label, br);
    }
    
    document.getElementById('question').innerHTML = getQuestion(quiz[currentQuestion]["question"], currentQuestion);

    if(currentQuestion == 0){
        document.getElementById('score').innerHTML = getProgressTag(0, quiz.length);
    }
}

function checkAnswer(){
    
    if(askingQuestion){

        
        if (currentQuestion != quiz.length - 1){
            document.getElementById('check').innerHTML = nextQuestionText;
        } else {
            document.getElementById('check').innerHTML = finishText;
        }
        askingQuestion = false;
        
        let userpick;
        let correctIndex;
        let radios = document.getElementsByName('quiz');
        for(let i = 0; i < radios.length; i++){
            if(radios[i].checked){
                userpick = radios[i].value;
            }
            if(radios[i].value == quiz[currentQuestion]["correct"]){
                correctIndex = i;
            }
        }
        
        if(userpick == quiz[currentQuestion]["correct"]){
            score++;
            document.getElementsByTagName('span')[correctIndex].style.color = "#0DFF00";
            document.getElementsByTagName('span')[correctIndex].style.fontWeight = "bold";
            document.getElementById('explanation').innerHTML = correctTag;
        } else {
            document.getElementsByTagName('span')[correctIndex].style.color = "#DE3838";
            document.getElementsByTagName('span')[correctIndex].style.fontWeight = "bold";
            document.getElementById('explanation').innerHTML = incorrectTag;
        }
        
        document.getElementById('explanation').innerHTML += '<p>' + quiz[currentQuestion]["explanation"] + '</p>';
        document.getElementById('score').innerHTML = getProgressTag(score, quiz.length);
        
        
    } else { 

        askingQuestion = true;
        
        document.getElementById('check').innerHTML = submitAnswerText;
        
        document.getElementById('explanation').innerHTML = "";
        
        if(currentQuestion < quiz.length - 1){
            currentQuestion++;
            loadQuestion();
        } else {
            showFinalResults();
        }

    }
}

function showFinalResults(){

    clearTimeout(quizTimeoutObj);
    clearInterval(intervalObj);


    document.getElementById('explanation').innerHTML = "";
    document.getElementById('clock').innerHTML = "";
    
    document.getElementById(quizBlockNameId).innerHTML = getResult(score, quiz.length);
    
    let button = document.getElementById('check');
    button.parentNode.removeChild(button);
    
    document.getElementById('question').innerHTML = "";
    document.getElementById("progressbar-container").style.display = "none";
    
}

function promptSetup() {

    let modal = document.getElementById("modal-container");
    let closeSpan = document.getElementsByClassName("close")[0];

    closeSpan.onclick = function() {
        modal.style.display = "none";

        loadQuestion();
        quizTimeoutObj = createQuizTimeout();
        showTime();
        document.getElementById("progressbar-container").style.display = "block";
        intervalObj = setInterval(showTime, 1000);
    }

}


function onLoadHandler() {

    try {
        fetch(quizDataFilename)
            .then(response => response.json())
            .then((json) => {
                quiz = json
                promptSetup();
            })
    } catch (error) {
        console.error(error)    
    }
}






window.onload = onLoadHandler;

