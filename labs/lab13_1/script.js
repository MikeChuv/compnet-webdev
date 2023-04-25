

let quiz;
let currentQuestion = 0;
let score = 0;
let askingQuestion = true;

const quizTimeout  = 10 * 1000;
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
    tickCounter++;
    let rem = (quizTimeout - tickCounter * tickInterval);
    let text = `Осталось времени: ${ms2HMSMs(rem)}`;
    clockDisplay.textContent = text;
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
    
    // clear out radio buttons from previous question
    document.getElementById(quizBlockNameId).innerHTML = "";
    
    // loop through choices, and create radio buttons
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
        
        // create a <br> tag to separate options
        const br = document.createElement('br');
        
        // attach them to content. Attach br tag, then label
        let contentEl = document.getElementById(quizBlockNameId);
        contentEl.appendChild(br);
        document.getElementById(quizBlockNameId).insertBefore(label, br);
    }
    
    // load the question
    document.getElementById('question').innerHTML = getQuestion(quiz[currentQuestion]["question"], currentQuestion);

    
    // setup score for first time
    if(currentQuestion == 0){
        document.getElementById('score').innerHTML = getProgressTag(0, quiz.length);
    }
}

function checkAnswer(){
    
    //are we asking a question, or proceeding to next question?
    if(askingQuestion){

        if (currentQuestion == 0){
            quizTimeoutObj = createQuizTimeout();
            showTime();
            intervalObj = setInterval(showTime, 1000);
        }
        
        //change button text to next question, so next time they click it, it goes to next question
        if (currentQuestion != quiz.length - 1){
            document.getElementById('check').innerHTML = nextQuestionText;
        } else {
            document.getElementById('check').innerHTML = finishText;
        }
        askingQuestion = false;
        
        //determine which radio button they clicked
        let userpick;
        let correctIndex;
        let radios = document.getElementsByName('quiz');
        for(let i = 0; i < radios.length; i++){
            if(radios[i].checked){ //if this radio button is checked
                userpick = radios[i].value;
            }
            //get index of correct answer
            if(radios[i].value == quiz[currentQuestion]["correct"]){
                correctIndex = i;
            }
        }
        
        //set the color if they got it right, or wrong
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
        
        
    } else { // reset form and move to next question

        // setting up so user can ask a question
        askingQuestion = true;
        
        // change button text back to 'submit answer'
        document.getElementById('check').innerHTML = submitAnswerText;
        
        document.getElementById('explanation').innerHTML = "";
        
        // if we're not on last question, increase question number
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
    
    // delete the button
    let button = document.getElementById('check');
    button.parentNode.removeChild(button);
    
    // remove question
    document.getElementById('question').innerHTML = "";
    
}


function onLoadHandler() {

    try {
        fetch(quizDataFilename)
            .then(response => response.json())
            .then((json) => {
                quiz = json
                loadQuestion();
            })
    } catch (error) {
        console.error(error)    
    }

}


window.onload = onLoadHandler;

