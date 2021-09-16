  
const colors = [
    '#FFFFFF',
    '#2196F3',
    '#4CAF50',
    '#FF9800',
    '#009688',
    '#795548',
  ];
  
  let timerID = null;
  const min = 0;
  const max = colors.length - 1;
  const randomIntegerFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  const refs = {
    start: document.querySelector('[data-action="start"]'),
    stop: document.querySelector('[data-action="stop"]'),
  };
  refs.stop.disabled = true;
  
 export default refs.start.addEventListener('click', () => {
    if (timerID) return;
  
    refs.start.disabled = true;
    refs.stop.disabled = false;
  
    timerID = setInterval(() => {
      const randomColorsIndex = randomIntegerFromInterval(min, max);
      const randomColor = colors[randomColorsIndex];
  
      document.body.style.backgroundColor = randomColor;
    }, 1000);
  });
  
  refs.stop.addEventListener('click', () => {
    refs.start.disabled = false;
    refs.stop.disabled = true;
  
    clearInterval(timerID);
    timerID = null;
  });


