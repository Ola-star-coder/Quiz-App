// so i changed this from const to let so that i can use it in my fetchQuestions function.
let questions = [];
let previousQuestions= [];

// The variables
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
// nothing chaged here, just the variable names
let currentQuestionIndex = 0;
let score = 0;
function startQuiz(){
    currentQuestionIndex = 0
    score = 0;
    nextButton.innerHTML = 'Next';
    showQuestion();
}

//The main piece. i added the fethcque function to fetch the questions from the API and i wrapped it in try and catch error to block errors
async function fetchQuestions(){
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=9');
        const data = await response.json();
        questions = data.results.map(q => ({
            question: q.question,
            answers: shuffle([
                {text: q.correct_answer, correct: true},
                ...q.incorrect_answers.map(ans => ({text: ans, correct:false}))
            ])
        }));
        // previous question is stored here
        previousQuestions = questions.map(q => ({
            question: q.question,
            answers: q.answers.map(a => ({
                text: a.text,
                correct: a.correct
            }))
        }));
        // i call the startQuiz function here to start the quiz after fetching the questions
        startQuiz();
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionElement.innerHTML = 'Error. Please try again later.';
        // The answer button were displaying so i hid it when there is error
        answerButtons.style.display = 'none';
        nextButton.style.display = 'none';
        return;
    }
};

// This function chages the answers so that the correct answer is not always first or equal
function shuffle (array){
    // this shufffle randomize the order of the quiz anwers
    return array.sort(() => Math.random() - 0.5);
}

// This function shows the question and the answers
function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + '.' + currentQuestion.question;
    
    // This is where my answers are displayed
    currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerHTML= answer.text;
    button.classList.add('btn');
    answerButtons.appendChild(button);
    if(answer.correct){
        button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    })
};

// This function resets the state of the quiz, it removes the answers and hides the next button so that it can be displayed when you slect an answer.
function resetState(){
 nextButton.style.display = 'none';
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
    const replayBtn = document.getElementById('replay-btn');
    if(replayBtn){
        replayBtn.remove();
    }
}

// This is just checking if answer is correct or not
function selectAnswer(event){
 const selectedBtn = event.target;
 const isCorrect = selectedBtn.dataset.correct === 'true';
 if(isCorrect){
    selectedBtn.classList.add('correct');
    score++;
 }else{
    selectedBtn.classList.add('wrong')
 }
   Array.from(answerButtons.children).forEach(button => {
    if(button.dataset.correct === 'true'){
        button.classList.add('correct');
    }
    button.disabled = true;
   });
   nextButton.style.display = 'block';
}

// This function shows our score at the end.
function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}, refresh for New Questions!`;
    nextButton.innerHTML = 'Play Again';
    nextButton.style.display = 'block';
}

// Well the next button
function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
};

// Its event listener.
nextButton.addEventListener('click', () => {
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

//former OG startQuiz();

// well our Og we called it here
fetchQuestions();