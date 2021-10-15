export default class rangeSlider {
    constructor(element, onChange, { startingMin, startingMax, min, max } = {}) {
      // Properties
      this.rangeMin = min;
      this.rangeMax = max;
      this.rangeSize = this.rangeMax - this.rangeMin;
      this.selectedMinPercent = Math.round((startingMin - this.rangeMin) / this.rangeSize * 100);
      this.selectedMaxPercent = Math.round((startingMax - this.rangeMin) / this.rangeSize * 100);

      // onChange callback
      this.onChange = onChange;

      this.slider = null;
      this.sliderBar = null;
      this.sliderBarStart = null;
      this.sliderBarEnd = null;
  
      // Event Properties
      this.startX = 0;
      this.currentX = 0;
      this.targetX = 0;
      this.target = null;
      this.targetBCR = null;
      this.sliderBCR = null;
      this.sliderStartX = null;
      this.sliderEndX = null;
      this.draggingBall = false;
    
      
      // Internal Elements
      this.rootElement = element;
      this.minControlElement = element.querySelector('#slider-min-control');
      this.maxControlElement = element.querySelector('#slider-max-control');
      this.sliderTarget = element.querySelector('#slider-target');
      
      // Bind methods
      this.addEventListeners = this.addEventListeners.bind(this);
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
      this.updateSliderValues = this.updateSliderValues.bind(this);
  
      this.addEventListeners();
      this.init();
      
      //requestAnimationFrame(this.updateSliderValues);
    }
    
    addEventListeners () {
      this.rootElement.addEventListener('touchstart', this.onStart);
      document.addEventListener('touchmove', this.onMove);
      document.addEventListener('touchend', this.onEnd);
      
      this.rootElement.addEventListener('mousedown', this.onStart);
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('mouseup', this.onEnd);

    }
    
    init () {
      
      this.slider = document.createElement('div');
      this.sliderBar = document.createElement('div');
      this.sliderBarStart = document.createElement('span');
      this.sliderBarEnd = document.createElement('span');
      
      this.slider.classList.add('range-slider');
      this.slider.dataset.min = "";
      this.slider.dataset.max = "";
      
      this.sliderBar.classList.add('range-slider__bar');
      this.sliderBarStart.classList.add('range-slider__ball');
      this.sliderBarEnd.classList.add('range-slider__ball');
      
      this.sliderBarStart.id = "min";
      this.sliderBarEnd.id = "max";
      
      this.sliderBar.appendChild(this.sliderBarStart);
      this.sliderBar.appendChild(this.sliderBarEnd);
      this.slider.appendChild(this.sliderBar);
      
      this.sliderTarget.appendChild(this.slider);
      this.updateSliderValues();
    }
    
    onStart (evt) {
      // ignore mousedown/touchstart if target is not one of the draggable balls
      if (!evt.target.classList.contains('range-slider__ball')) {
        return;
      }
      
      // saving current draggable element
      this.target = evt.target;
      this.sliderBCR = this.slider.getBoundingClientRect();
      this.targetBCR = this.target.getBoundingClientRect();
      
      this.sliderStartX = this.sliderBCR.left;
      this.sliderEndX = this.sliderBCR.right;
      
      this.startX = evt.pageX || evt.touches[0].pageX;
      this.currentX = this.startX;
      
      this.draggingBall = true;

      evt.preventDefault();
    }
    
    onMove (evt) {
      // ignoring mouse moves if we are not dragging a ball
      if (!this.draggingBall || !this.target)
        return;
      
      // if mouse/finger is outside of the slider already - ignore the move
      this.currentX = evt.pageX || evt.touches[0].pageX;
      if (this.currentX < this.sliderStartX || this.currentX > this.sliderEndX)
        return;
      
      // if min/left ball is being dragged - update the min selected value
      if (this.target === this.sliderBarStart)
        this.selectedMinPercent = this._calculatePercentage(this.currentX - this.sliderStartX);
  
      // if max/right ball is being dragged - update the max selected value
      if (this.target === this.sliderBarEnd)
        this.selectedMaxPercent = this._calculatePercentage(this.currentX - this.sliderStartX);

      // update (redraw) the slider
      requestAnimationFrame(this.updateSliderValues);
    }
    
    onEnd () {
      if (!this.draggingBall || !this.target)
        return;
  
      this.draggingBall = false;
      this.onChange( this.getSelectedMin(), this.getSelectedMax())
    }
  
    
    updateSliderValues () {

      this.selectedMinPercent = Math.floor(this.selectedMinPercent);
      this.selectedMaxPercent = Math.ceil(this.selectedMaxPercent);

      //updating the data attribute to display new values near the balls
      this.sliderBarStart.dataset.before = this.getSelectedMin();
      this.sliderBarEnd.dataset.before = this.getSelectedMax();
      
      // actually changing the slider bar
      this.sliderBar.style.left = `${this.selectedMinPercent}%`;
      this.sliderBar.style.right = `${100 - this.selectedMaxPercent}%`;
    }

    getSelectedMin () {
      return Math.floor(this.rangeSize * this.selectedMinPercent / 100 + this.rangeMin);
    }
    
    getSelectedMax () {
      return Math.ceil(this.rangeSize * this.selectedMaxPercent / 100 + this.rangeMin);
    }

    _calculatePercentage (positionInSlider) {
      return positionInSlider / this.sliderBCR.width * 100;
    }
    
    __logElements() {

    }
  }
  

