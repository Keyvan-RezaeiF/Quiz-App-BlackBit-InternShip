// slider
const sliderImages = document.getElementsByClassName("slide");
const sliderDots = document.getElementsByClassName("slider_dots");

let slideIndex = 1;
showSlide(slideIndex);

function nextSlide(n) {
  showSlide(slideIndex += n);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function showSlide(n) {
  if (n > sliderImages.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = sliderImages.length;
  }

  for (let i = 0; i < sliderImages.length; i++) {
    sliderImages[i].style.display = "none";
  }

  for (let i = 0; i < sliderDots.length; i++) {
    sliderDots[i].className = sliderDots[i].className.replace(" slider_dots_white", "");
  }

  sliderImages[slideIndex-1].style.display = "block";
  sliderDots[slideIndex-1].className += " slider_dots_white";
}

setInterval(() => {
  nextSlide(1)
}, 3000);

// Create Quiz

const questionCounter = document.querySelector('#question_counter')
const numberError = document.querySelector('#number_error')
const questionAnswerDiv = document.querySelector('.question_answer')
const quizesDiv = document.querySelector('.quizes')
const quizToTake = document.querySelector('.quiz_to_take')

class Quiz {
  constructor(questions) {
    this.index = quizIndex++
    this.questions = questions
  }
}

class Question {
  constructor(index, text, choices, answerIndex) {
    this.index = index
    this.text = text
    this.choices = choices
    this.answerIndex = answerIndex
  }
}

function renderPreviousQuestion(event) {
  event.preventDefault()

  if (questionIndex > 0) {
    questionIndex--;

    const currentQuiz = JSON.parse(localStorage.getItem('Current Quiz'))

    if (currentQuiz && currentQuiz[questionIndex]) {
      const {text, choices, answerIndex} = currentQuiz[questionIndex]
      document.querySelector('#question_box').value = text
      for (let i = 1; i <= numOfChoices; i++) {
        document.querySelector(`.choice${i}`).value = choices[i - 1]
      }
      document.querySelector('.correct_choice').value = answerIndex + 1
    } else {
      document.querySelector('#question_box').value = ""
      for (let i = 1; i <= numOfChoices; i++) {
        document.querySelector(`.choice${i}`).value = ""
      }
      document.querySelector('.correct_choice').value = ""
    }
  }
}

function renderNextQuestion(event) {
  event.preventDefault()

  if (questionIndex < questionCounter.value - 1) {
    questionIndex++;

    const currentQuiz = JSON.parse(localStorage.getItem('Current Quiz'))

    if (currentQuiz && currentQuiz[questionIndex]) {
      const {text, choices, answerIndex} = currentQuiz[questionIndex]
      document.querySelector('#question_box').value = text
      for (let i = 1; i <= 4; i++) {
        document.querySelector(`.choice${i}`).value = choices[i - 1]
      }
      document.querySelector('.correct_choice').value = answerIndex + 1
    } else {
      document.querySelector('#question_box').value = ""
      for (let i = 1; i <= numOfChoices; i++) {
        document.querySelector(`.choice${i}`).value = ""
      }
      document.querySelector('.correct_choice').value = ""
    }
  }
}

function saveQuestion(event) {
  event.preventDefault()

  const answerDiv = document.querySelector('.correct_choice')
  const answerIndex = answerDiv.value
  if (answerIndex >= 1 && answerIndex <= 4) { // check answer box to be not empty
    const questionBox = document.querySelector('#question_box')
    if (questionBox.value.length != 0) { // check question box to be not empty
      const choices = []
      for (let i = 1; i <= numOfChoices; i++) {
        const choiceDiv = document.querySelector(`.choice${i}`)
        const choice = document.querySelector(`.choice${i}`).value
        if (choice.length != 0) { // check choice box to be not empty
          choices.push(choice)
        } else {
          const choiceError = document.createElement('span')
          choiceError.textContent = "Choice field must not be empty!"
          choiceError.style.color = "red"
          choiceDiv.parentNode.insertBefore(choiceError, choiceDiv.nextSibling);
          // break;
        }
      }

      const newQuestion = new Question(questionIndex, questionBox.value, choices, answerIndex - 1)
      questions[questionIndex] = newQuestion
      localStorage.setItem('Current Quiz', JSON.stringify(questions))
    } else {
      const questionError = document.createElement('span')
      questionError.textContent = "Question field must not be empty!"
      questionError.style.color = "red"
      questionBox.parentNode.insertBefore(questionError, questionBox.nextSibling);
    }
  } else {
    const answerError = document.createElement('span')
    answerError.textContent = "Answer must be between 1 to 4 !"
    answerError.style.color = "red"
    answerDiv.parentNode.insertBefore(answerError, answerDiv.nextSibling);
  }

  if (questionIndex == questionCounter.value - 1) {
    saveQuiz()
  }
}

function saveQuiz() {
  const newQuiz = new Quiz(questions)
  quizes.push(newQuiz)
  questionIndex = 0
  localStorage.setItem('Quiz Bank', JSON.stringify(quizes))
  localStorage.removeItem('Current Quiz')

  const createQuizDiv = document.querySelector('#create_quiz_container')
  while(createQuizDiv.firstChild) {
    createQuizDiv.removeChild(createQuizDiv.firstChild)
  }

  renderQuizesSection()
}

function takeNextQuestion(event) {
  event.preventDefault()

  updateScore(questionIndex)

  const { questions } = quizes[quizIndex]

  if (questionIndex < questions.length - 1) {
    questionIndex++;

    const questionBox = document.querySelector('.questions')
    questionBox.innerText = `${questionIndex + 1}. ${questions[questionIndex].text}` // sth

    const choicesDiv = document.querySelector(`.choices`)
    while(choicesDiv.firstChild) {
      choicesDiv.removeChild(choicesDiv.firstChild)
    }
    for (let i = 1; i <= numOfChoices; i++) {
      choicesDiv.innerHTML += `
      <div>
        <input type="radio" name="choice" id="choice${i}">
        <label>${questions[questionIndex].choices[i - 1]}</label>
      </div>
      `
    }
    updateRadioButtons(questionIndex)
  }
}

function finishTakingQuiz(event) {
  event.preventDefault()

  updateScore(questionIndex)
  calculateScore()

  while(quizToTake.firstChild) {
    quizToTake.removeChild(quizToTake.firstChild)
  }

  const scoreBoard = document.createElement('h4')
  scoreBoard.innerText = ` Your score is ${userScore} of ${userAnswers.length}`
  quizToTake.appendChild(scoreBoard)

  // Hide taken quiz
}

function calculateScore() {
  const { questions } = quizes[quizIndex]
  for (let i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] == questions[i].answerIndex) {
      userScore++
    }
  }
}

function takePreviousQuestion(event) {
  event.preventDefault()

  updateScore(questionIndex)

  const { questions } = quizes[quizIndex]

  if (questionIndex > 0) {
    questionIndex--;

    const questionBox = document.querySelector('.questions')
    questionBox.innerText = `${questionIndex + 1}. ${questions[questionIndex].text}` // sth

    const choicesDiv = document.querySelector(`.choices`)
    while(choicesDiv.firstChild) {
      choicesDiv.removeChild(choicesDiv.firstChild)
    }
    for (let i = 1; i <= numOfChoices; i++) {
      choicesDiv.innerHTML += `
      <div>
        <input type="radio" name="choice" id="choice${i}">
        <label>${questions[questionIndex].choices[i - 1]}</label>
      </div>
      `
    }
    updateRadioButtons(questionIndex)
  }
}

function updateRadioButtons(questionIndex) {
  const userAnswer = userAnswers[questionIndex]
  if (userAnswer != -1) {
    document.getElementById(`choice${userAnswer + 1}`).checked = true
  }
}

function updateScore(questionIndex) {
  if (document.querySelector('#choice1').checked) {
    userAnswers[questionIndex] = 0
  } else if (document.querySelector('#choice2').checked) {
    userAnswers[questionIndex] = 1
  } else if (document.querySelector('#choice3').checked) {
    userAnswers[questionIndex] = 2
  } else if (document.querySelector('#choice4').checked) {
    userAnswers[questionIndex] = 3
  }
}

function takeQuiz(quizIndexToTake) {

  quizIndex = quizIndexToTake
  const questions = quizes[quizIndex].questions
  questionIndex = 0
  const question = questions[questionIndex]

  for (let i = 0; i < questions.length; i++) {
    userAnswers.push(-1)
  }

  quizToTake.innerHTML += `
    <div class="col">
      <a href="#">
        <button class="previous_button">
          Previous
        </button>
      </a>
      <a href="#">
        <button class="next_button">
          Next
        </button>
      </a>
      <a href="#">
        <button class="finish_button">
          Finish
        </button>
      </a>
    </div>
    <div class="qa_to_take">
      <div class="questions">
        ${1}. ${question.text}
      </div>
      <div class="choices">
        <div>
          <input type="radio" name="choice" id="choice1">
          <label>${question.choices[0]}</label>
        </div>
        <div>
          <input type="radio" name="choice" id="choice2">
          <label>${question.choices[1]}</label>
        </div>
        <div>
          <input type="radio" name="choice" id="choice3">
          <label>${question.choices[2]}</label>
        </div>
        <div>
          <input type="radio" name="choice" id="choice4">
          <label>${question.choices[3]}</label>
        </div>
      </div>
    </div>
  `

  const nextBtn = document.querySelector('.col .next_button')
  const finishBtn = document.querySelector('.col .finish_button')
  const previousBtn = document.querySelector('.col .previous_button')

  nextBtn.addEventListener('click', takeNextQuestion)
  finishBtn.addEventListener('click', finishTakingQuiz)
  previousBtn.addEventListener('click', takePreviousQuestion)
}

function renderQuizesSection() {
  while(quizesDiv.firstChild) {
    quizesDiv.removeChild(quizesDiv.firstChild)
  }

  const quizes = JSON.parse(localStorage.getItem('Quiz Bank'))
  quizes ?
    quizes.map(quiz => {
      quizesDiv.innerHTML += `
        <div class="quiz_card">
          <div class="box">
            <div class="content">
              <h2>${quiz.index + 1}</h2>
              <h3>Quiz ${quiz.index + 1}</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, totam velit? Iure nemo labore inventore?</p>
              <a href="#" onclick="takeQuiz(${quiz.index})">Take this quiz</a>
            </div>
          </div>
        </div>
      `
    }) :
    quizesDiv.innerHTML += `<p>There is no available quiz to take now!</p>`
}

function createQuiz() {
  if (questionCounter.value > 0) {
    numOfQuestions = questionCounter.value;
    while (questionAnswerDiv.firstChild) {
      questionAnswerDiv.removeChild(questionAnswerDiv.firstChild);
    }

    // render question and answer fields to fill them out
    questionAnswerDiv.innerHTML += `
    <div class="quiz_creation">
      <div>
        <a href="#">
          <button class="previous_button">
            Previous
          </button>
        </a>
      </div>
      <div class="qa">
        <textarea
          name=""
          id="question_box"
          cols="60"
          rows="10"
          placeholder="Type the question here ..."
        ></textarea>
        <textarea class="choice1" placeholder="Type choice 1 here ..."></textarea>
        <textarea class="choice2" placeholder="Type choice 2 here ..."></textarea>
        <textarea class="choice3" placeholder="Type choice 3 here ..."></textarea>
        <textarea class="choice4" placeholder="Type choice 4 here ..."></textarea>
        <textarea class="correct_choice" placeholder="Type the correct choice here ..."></textarea>
        <a href="#">
          <button class="save_button">
            Save
          </button>
        </a>
      </div>
      <div>
        <a href="#">
          <button class="next_button">
            Next
          </button>
        </a>
      </div>
    </div>
    `

    const nextBtn = document.querySelector('.next_button')
    const saveBtn = document.querySelector('.save_button')
    const previousBtn = document.querySelector('.previous_button')

    nextBtn.addEventListener('click', renderNextQuestion)
    saveBtn.addEventListener('click', saveQuestion)
    previousBtn.addEventListener('click', renderPreviousQuestion)

  } else {
    numberError.innerText = "Number of questions must be more than 0 !"
  }
}



// Main

const localQuizBank = JSON.parse(localStorage.getItem('Quiz Bank'))
const quizes = localQuizBank ? localQuizBank : []
let quizIndex = quizes ? quizes.length : 0

let questionIndex = 0
const numOfChoices = 4
const questions = []

const userAnswers = []
let userScore = 0

renderQuizesSection()