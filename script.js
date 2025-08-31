"use strict";

const translationWords = [
  {
    english: "apple",
    russian: "яблоко",
    example: "The apple fell from the tree."
  },
  {
    english: "home",
    russian: "дом",
    example: "Make yourself at home."
  },
  {
    english: "car",
    russian: "автомобиль",
    example: "I always go to work by car."
  },
  {
    english: "orange",
    russian: "апельсин",
    example: "Oranges are packed full of vitamin C."
  },
  {
    english: "cat",
    russian: "кот",
    example: "The cat likes to sit by the window."
  },
  {
    english: "street",
    russian: "улица",
    example: "What's the name of the street?"
  },
];

const examMode = document.querySelector('#exam-mode');
const englishWord = document.querySelector('#card-front h1');
const translation = document.querySelector('#card-back h1');
const englishExample = document.querySelector('#card-back span');
const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');
totalWord.textContent = translationWords.length;
const wordsProgress = document.querySelector('#words-progress');
wordsProgress.value = (currentWord.textContent * 100) / translationWords.length;

let wordIndex = 0;
let translationWord = translationWords[0];
const ContainerExamCards = document.querySelector('#exam-cards');

function makeCard() {
  translationWord = translationWords[wordIndex];
  englishWord.textContent = translationWord.english;
  translation.textContent = translationWord.russian;
  englishExample.textContent = translationWord.example;
}

makeCard();

const examWords = [...translationWords];

function mixWords(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function makeExamCards() {
  examWords.forEach(el => {
    delete el.example;

    for (let value of Object.values(el)) {
      const divWord = document.createElement('div')
      divWord.classList.add('card');
      divWord.textContent = value;
      ContainerExamCards.append(divWord);
    }
  });
  const examCards = ContainerExamCards.querySelectorAll('.card');
  const divWords = Array.from(examCards);
  const mixDivWords = mixWords(divWords);

  mixDivWords.forEach(div => {
    ContainerExamCards.append(div);
  });
}


function countPercent() {
  const correctPercent = document.querySelector('#correct-percent');
  const examProgress = document.querySelector('#exam-progress');
  let percent = parseInt(correctPercent.textContent);
  percent = percent + 100 / translationWords.length;

  if (percent > 100) {
    percent = 100;
  }

  correctPercent.textContent = `${Math.round(percent)} %`;
  examProgress.value = percent;
}

let timer = false;

function showTime() {
  const time = document.querySelector('#time');
  const timeString = time.textContent;
  const timeArray = timeString.split(':');
  let minutes = +timeArray[0];
  let seconds = +timeArray[1];
  let intervalId = setInterval(() => {
    if (seconds === 60) {
      minutes++;
      seconds = 1;
    } else {
      seconds++;
    }
    const formatMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formatSeconds = seconds < 10 ? '0' + seconds : seconds;
    time.textContent = `${formatMinutes}:${formatSeconds}`;

    if (timer) {
      clearInterval(intervalId);
    }
  }, 1000);
}

function finishExam() {
  const containerDivs = document.querySelectorAll('.card');
  let endExam = true;

  for (let item of containerDivs) {
    if (!item.classList.contains('correct')) {
      endExam = false;
      break;
    }
  }

  if (endExam) {
    timer = true;
    setTimeout(() => {
      alert('Тестирование окончено!');
    }, 1000);
  }
}

let firstClikcedCard = null;

document.addEventListener('click', function (event) {
  const flipCard = event.target.closest('.flip-card');

  if (flipCard) {
    flipCard.classList.toggle('active');
  }

  const btnNext = event.target.closest('#next');

  if (btnNext) {
    document.querySelector('#back').disabled = false;
    wordIndex++;
    makeCard();
    currentWord.textContent = ++currentWord.textContent;
    if (+currentWord.textContent === translationWords.length) {
      btnNext.disabled = true;
    }
    wordsProgress.value = currentWord.textContent * 100 / translationWords.length;
  }

  const btnBack = event.target.closest('#back');

  if (btnBack) {
    document.querySelector('#next').disabled = false;
    wordIndex--;
    makeCard();
    currentWord.textContent = --currentWord.textContent;
    if (+currentWord.textContent === 1) {
      btnBack.disabled = true;
    }
    wordsProgress.value = currentWord.textContent * 100 / translationWords.length;
  }

  const btnExam = event.target.closest('#exam');

  if (btnExam) {
    examMode.classList.remove('hidden');
    document.querySelector('#study-mode').classList.add('hidden');
    document.querySelector('.study-cards').classList.add('hidden');
    makeExamCards();
    showTime();
  }

  const card = event.target.closest('.card');

  if (card) {
    if (firstClikcedCard === null) {
      firstClikcedCard = card;
      firstClikcedCard.classList.add('correct');
    } else {
      const firstWord = firstClikcedCard.textContent;
      const secondCard = event.target.closest('.card');
      const secondWord = secondCard.textContent;
      const foundInOneObj = examWords.some(obj => (obj.english === firstWord && obj.russian === secondWord) || (obj.english === secondWord && obj.russian === firstWord));
      if (foundInOneObj) {
        secondCard.classList.add('correct');
        secondCard.classList.add('fade-out');
        firstClikcedCard.classList.add('fade-out');
        firstClikcedCard = null;
        countPercent();
      } else {
        secondCard.classList.add('wrong');
        setTimeout(() => {
          secondCard.classList.remove('wrong');
          firstClikcedCard.classList.remove('correct');
          firstClikcedCard = null;
        }, 500);
      }
    }
    finishExam();
  }

  const btnShuffleWords = event.target.closest('#shuffle-words');

  if (btnShuffleWords) {
    mixWords(translationWords);
    makeCard();
  }
})


