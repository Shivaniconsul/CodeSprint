let timer;
let startTime;
let elapsedTime = 0;
let isRunning = false;

const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

function updateTime() {
  const now = Date.now();
  elapsedTime = now - startTime;
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  timeDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

startButton.addEventListener('click', () => {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateTime, 1000);
    isRunning = true;
  }
});

pauseButton.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
  }
});

resetButton.addEventListener('click', () => {
  clearInterval(timer);
  elapsedTime = 0;
  timeDisplay.textContent = '00:00:00';
  isRunning = false;
});

// Restore timer state from storage
chrome.storage.sync.get(['elapsedTime', 'isRunning'], (data) => {
  if (data.elapsedTime) {
    elapsedTime = data.elapsedTime;
    updateTime();
  }
  if (data.isRunning) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateTime, 1000);
    isRunning = true;
  }
});

// Save timer state to storage
window.addEventListener('unload', () => {
  chrome.storage.sync.set({ elapsedTime, isRunning });
});
