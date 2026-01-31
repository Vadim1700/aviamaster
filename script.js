let signals = [];
let isCooldown = false;
let countdownInterval;

const getSignalBtn = document.getElementById("getSignalBtn");
const distanceEl = document.getElementById("distance");
const coefEl = document.getElementById("coef");
const loader = document.getElementById("loader");
const countdownEl = document.getElementById("countdown");

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const addSignalBtn = document.getElementById("addSignalBtn");
const signalList = document.getElementById("signalList");

openModal.onclick = () => modal.style.display = "flex";
closeModal.onclick = () => modal.style.display = "none";

addSignalBtn.onclick = () => {
  const distance = document.getElementById("distanceInput").value;
  const coef = document.getElementById("coefInput").value;

  if(distance && coef){
    signals.push({distance, coef});
    updateSignalList();
    document.getElementById("distanceInput").value = "";
    document.getElementById("coefInput").value = "";
  }
};

function updateSignalList(){
  signalList.innerHTML = "";
  signals.forEach((signal, index) => {
    const li = document.createElement("li");
    li.textContent = `${signal.distance}m | ${signal.coef}x`;
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      signals.splice(index, 1);
      updateSignalList();
    };
    li.appendChild(delBtn);
    signalList.appendChild(li);
  });
}

function animateDigits(element, text, color){
  element.innerHTML = "";
  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.color = color;
    span.style.fontWeight = "900";
    span.style.fontFamily = "Bighaustitul, sans-serif";
    span.style.textShadow = `2px 2px 5px #000, 0 0 15px ${color}`;
    span.style.transition = "transform 0.6s ease-in-out";
    element.appendChild(span);

    setInterval(() => {
      span.style.transform = i % 2 === 0 ? "scale(1.2)" : "scale(0.95)";
      setTimeout(() => {
        span.style.transform = "scale(1)";
      }, 600);
    }, 1400 + i * 200);
  });
}

function startCountdown(seconds){
  let remaining = seconds;
  countdownEl.textContent = `⏳ Задержка: ${remaining} сек`;
  countdownInterval = setInterval(() => {
    remaining--;
    countdownEl.textContent = `⏳ Задержка: ${remaining} сек`;
    if(remaining <= 0){
      clearInterval(countdownInterval);
      countdownEl.textContent = "";
      getSignalBtn.disabled = false;
      getSignalBtn.textContent = "Получить сигнал";
      isCooldown = false;
    }
  }, 1000);
}

getSignalBtn.onclick = () => {
  if(isCooldown || signals.length === 0) return;

  getSignalBtn.disabled = true;
  getSignalBtn.textContent = "Загрузка...";
  loader.style.display = "block";
  distanceEl.textContent = "";
  coefEl.textContent = "";

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * signals.length);
    const randomSignal = signals[randomIndex];

    loader.style.display = "none";
    animateDigits(coefEl, "x" + randomSignal.coef, "limegreen");
    animateDigits(distanceEl, randomSignal.distance + "m", "orange");
    

    // удаляем сигнал после получения
    signals.splice(randomIndex, 1);
    updateSignalList();

    getSignalBtn.textContent = "Ожидание...";
    isCooldown = true;

    // запуск таймера задержки
    startCountdown(15);

  }, 2000); // имитация загрузки 2 сек
};
