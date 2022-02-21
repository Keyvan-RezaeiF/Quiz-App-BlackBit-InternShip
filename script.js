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
    this.index = quiz_index++
    this.questions = questions
  }
}

class Question {
  constructor(index, text, choices, answer) {
    this.index = index
    this.text = text
    this.choices = choices
    this.answer = answer
  }
}

function renderPreviousQuestion(event) {
  event.preventDefault()

  if (question_index > 0) {
    question_index--;

    const current_quiz = JSON.parse(localStorage.getItem('Current Quiz'))

    if (current_quiz && current_quiz[question_index]) {
      const {text, choices, answer} = current_quiz[question_index]
      document.querySelector('#question_box').value = text
      for (let i = 1; i <= numOfChoices; i++) {
        document.querySelector(`.choice${i}`).value = choices[i - 1]
      }
      answer_index = choices.indexOf(answer)
      document.querySelector('.correct_choice').value = answer_index + 1
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

  if (question_index < questionCounter.value - 1) {
    question_index++;

    const current_quiz = JSON.parse(localStorage.getItem('Current Quiz'))

    if (current_quiz && current_quiz[question_index]) {
      const {text, choices, answer} = current_quiz[question_index]
      document.querySelector('#question_box').value = text
      for (let i = 1; i <= 4; i++) {
        document.querySelector(`.choice${i}`).value = choices[i - 1]
      }
      answer_index = choices.indexOf(answer)
      document.querySelector('.correct_choice').value = answer_index + 1
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
  const answer_index = answerDiv.value
  if (answer_index >= 1 && answer_index <= 4) { // check answer box to be not empty
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
      answer = choices[answer_index - 1]

      const newQuestion = new Question(question_index, questionBox.value, choices, answer)
      questions[question_index] = newQuestion
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

  if (question_index == questionCounter.value - 1) {
    saveQuiz()
  }
}

function saveQuiz() {
  const newQuiz = new Quiz(questions)
  quizes.push(newQuiz)
  question_index = 0
  localStorage.setItem('Quiz Bank', JSON.stringify(quizes))
  localStorage.removeItem('Current Quiz')

  const createQuizDiv = document.querySelector('#create_quiz_container')
  while(createQuizDiv.firstChild) {
    createQuizDiv.removeChild(createQuizDiv.firstChild)
  }

  renderQuizesSection()
}

function takeQuiz(quiz_index) {
  const questions = quizes[quiz_index].questions
  console.log(questions)
  questions.map(question => {
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
          ${questions.indexOf(question) + 1}. ${question.text}
        </div>
        <div class="choices">
          <div>
            <input type="radio" name="choice">
            <label>${question.choices[0]}</label>
          </div>
          <div>
            <input type="radio" name="choice">
            <label>${question.choices[1]}</label>
          </div>
          <div>
            <input type="radio" name="choice">
            <label>${question.choices[2]}</label>
          </div>
          <div>
            <input type="radio" name="choice">
            <label>${question.choices[3]}</label>
          </div>
        </div>
      </div>
      <div>
        quiz questions numbers
      </div>
    `
  })
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
let quiz_index = quizes ? quizes.length : 0;

let question_index = 0;
const numOfChoices = 4;
const questions = []

renderQuizesSection()