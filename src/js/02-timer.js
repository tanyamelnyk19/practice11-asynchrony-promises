import flatpickr from 'flatpickr';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

let selectedDateInMs = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    selectedDateInMs = selectedDate.getTime();
    const currentDateInMs = Date.now();

    if (selectedDateInMs < currentDateInMs) {
      // window.alert('Please choose a date in the future');
      // Notify.failure('Please choose a date in the future');
      Report.failure(
        'Failure',
        'Please choose a date in the future',
        'OK',
      );
      return;
    }

    refs.startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  const intervalId = setInterval(() => {
    const currentDate = Date.now();
    const deltaTime = selectedDateInMs - currentDate;

    if (deltaTime <= 0) {
      clearInterval(intervalId);
      Report.success(
        'Success',
        'Countdown Finished!',
        'OK',
      );
      refs.startBtn.disabled = true;
      return;
    }

    const time = convertMs(deltaTime);
    updateTimerInterface(time);
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}
