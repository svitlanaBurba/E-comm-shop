const padDate = num => String(num).padStart(2, 0);

class CountdownTimer {
  constructor({selector, targetDate}) {
    this.selector = selector;
    this.targetDate = targetDate;

    this.refs = {
      days: document.querySelector(`${this.selector} span[data-value="days"]`),
      hours: document.querySelector(
        `${this.selector} span[data-value="hours"]`
      ),
      mins: document.querySelector(`${this.selector} span[data-value="mins"]`),
      secs: document.querySelector(`${this.selector} span[data-value="secs"]`)
    };
  }

  start() {
    this.changeDate();
    setInterval(() => {
      this.changeDate();
    }, 1000);
  }
  changeDate() {
    const curYear = new Date().getFullYear();

    if (this.targetDate < new Date()) {
      this.targetDate.setFullYear(curYear + 1);
    }

    const deltaTime = this.targetDate - new Date();
    this.getTimeComponents(deltaTime);
  }

  getTimeComponents(time) {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = padDate(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const mins = padDate(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = padDate(Math.floor((time % (1000 * 60)) / 1000));
    this.updateClockFace(days, hours, mins, secs);
  }

  updateClockFace(days, hours, mins, secs) {
    this.refs.days.textContent = days;
    this.refs.hours.textContent = hours;
    this.refs.mins.textContent = mins;
    this.refs.secs.textContent = secs;
  }
}

export default CountdownTimer;

