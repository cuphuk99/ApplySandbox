window.addEventListener('load', () => {
  document.getElementById("time-up-overlay").classList.remove("show");
});

const container = document.getElementById("pairs-container");
const btn = document.getElementById("new-pairs-btn");

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function generateIndexes(array) {
  return [getRandomIndex(array.length)];
}

function createCard(text) {
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = text;
  div.style.fontWeight = "bold";
  return div;
}

function createLanguageBlock(profession, modifier, label) {
const colors = [
"#D32F2F", // яскраво-червоний
"#1976D2", // яскраво-синій
"#388E3C", // яскраво-зелений
"#F57C00", // яскраво-помаранчевий
"#7B1FA2", // фіолетовий
"#00796B", // бірюзовий
"#C2185B", // темно-рожевий
"#303F9F", // індиго
"#FBC02D", // яскраво-жовтий
"#512DA8", // темний фіолетовий
"#0097A7", // яскраво-бірюзовий
"#D84315", // насичений червоно-оранжевий
"#388E3C", // смарагдовий зелений
"#5D4037", // темно-коричневий
"#455A64", // темно-сірий із синім відтінком
"#E64A19", // насичений оранжевий
"#303F9F", // індиго
"#00796B", // бірюзовий
"#AFB42B", // яскраво-оливковий
"#C62828", // темний червоний
"#283593", // темно-синій
];

const color = colors[Math.floor(Math.random() * colors.length)];

const block = document.createElement("div");
block.className = "language-block";

const professionCard = createCard(profession);
professionCard.style.borderColor = color;
professionCard.style.color = color;

const modifierCard = createCard(modifier);
modifierCard.style.borderColor = color;
modifierCard.style.color = color;

block.appendChild(professionCard);
block.appendChild(modifierCard);

const langLabel = document.createElement("div");
langLabel.className = "language-label";
langLabel.textContent = label;
langLabel.style.color = color;
block.appendChild(langLabel);

return block;
}

function renderPairs() {
  container.innerHTML = "";
  container.style.opacity = 0;

  const indexesProf = generateIndexes(Object.keys(professions));
  const valueOfIndexProf = Object.keys(professions)[indexesProf]
  const indexesModifiers = generateIndexes(Object.keys(modifiers));
  const valueOfindexesModifiers = Object.keys(modifiers)[indexesModifiers]
  console.log()
    const row = document.createElement("div");
    row.className = "pair-row";
    selectedLanguages.forEach(lang => {
      if (lang === 'ua') {
        row.appendChild(createLanguageBlock(professions[valueOfIndexProf].ua, modifiers[valueOfindexesModifiers].ua, "Українська"));
      }
      if (lang === 'en') {
        row.appendChild(createLanguageBlock(professions[valueOfIndexProf].en, modifiers[valueOfindexesModifiers].en, "English"));
      }
      if (lang === 'sk') {
        row.appendChild(createLanguageBlock(professions[valueOfIndexProf].sk, modifiers[valueOfindexesModifiers].sk, "Slovenský"));
      }
    });

    container.appendChild(row);
  requestAnimationFrame(() => {
    container.style.animation = "none";
    container.offsetHeight;
    container.style.animation = null;
  });
}

btn.addEventListener("click", renderPairs);

let selectedLanguages = [];

document.querySelectorAll('.lang-flag').forEach(flag => {
flag.addEventListener('click', () => {
  const lang = flag.dataset.lang;
  flag.classList.toggle('selected');

  if (flag.classList.contains('selected')) {
    selectedLanguages.push(lang);
  } else {
    selectedLanguages = selectedLanguages.filter(l => l !== lang);
  }

  // Заборонити 0 вибраних мов
  document.getElementById('start-app-btn').disabled = selectedLanguages.length === 0;
});
});

document.getElementById('start-app-btn').addEventListener('click', () => {
// Показати основну частину
document.getElementById('language-selection').style.display = 'none';
document.getElementById('main-app').style.display = 'block';
renderPairs(); // запускаємо перше відображення
});


renderPairs();
// timer block
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-timer-btn");
const resetBtn = document.getElementById("reset-timer-btn");
const backBtn = document.getElementById("back-to-language-btn");
const ringProgress = document.querySelector(".ring-progress");

const radius = 60;
const circumference = 2 * Math.PI * radius;

ringProgress.style.strokeDasharray = `${circumference}`;
ringProgress.style.strokeDashoffset = `0`;

let timerInterval = null;
let isRunning = false;

function setProgress(percent) {
const offset = (percent / 100) * circumference;
ringProgress.style.strokeDashoffset = offset;
}

function resetTimer() {
clearInterval(timerInterval);
ringProgress.style.transition = "none";
setProgress(0);
timerDisplay.textContent = "30";
isRunning = false;
document.getElementById("time-up-overlay").classList.remove("show");
}
function showTimeUpOverlay() {
const overlay = document.getElementById("time-up-overlay");
overlay.classList.add("show");

// Автоматично приховати через 4 секунди (за бажанням)
setTimeout(() => {
  overlay.classList.remove("show");
}, 4000);
}
startBtn.addEventListener("click", () => {
if (isRunning) return;

isRunning = true;
let timeLeft = 30;

timerDisplay.textContent = timeLeft;
setProgress(0);

requestAnimationFrame(() => {
  ringProgress.style.transition = 'stroke-dashoffset 30s linear';
  setProgress(100);
});

timerInterval = setInterval(() => {
  timeLeft--;
  timerDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    resetTimer();
    showTimeUpOverlay();
  }
}, 1000);
});

resetBtn.addEventListener("click", () => {
resetTimer();
});

backBtn.addEventListener("click", () => {
document.getElementById("main-app").style.display = "none";
document.getElementById("language-selection").style.display = "flex";

selectedLanguages = [];
document.querySelectorAll(".lang-flag").forEach(flag => flag.classList.remove("selected"));
document.getElementById("start-app-btn").disabled = true;
document.getElementById("pairs-container").innerHTML = "";

resetTimer();
});


document.getElementById("back-to-language-btn").addEventListener("click", () => {
// Повертаємося на вибір мов
document.getElementById("main-app").style.display = "none";
document.getElementById("language-selection").style.display = "flex";

// Скидаємо вибір мов
selectedLanguages = [];
document.querySelectorAll(".lang-flag").forEach(flag => flag.classList.remove("selected"));
document.getElementById("start-app-btn").disabled = true;

// Очистити попередні пари (опційно)
document.getElementById("pairs-container").innerHTML = "";
});

////////////////////
