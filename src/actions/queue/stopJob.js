import store from 'Root/store';
import moment from 'moment';

let stopTimeout;

const stopJob = () => {
  const time = moment(store.getState().queue.endTime, 'hh:mm:ss');
  const now = moment();

  let diff = (time.hour() * 60 * 60 * 1000 + time.minute() * 60 * 1000 + time.second() * 1000)
  - (now.hour() * 60 * 60 * 1000 + now.minute() * 60 * 1000 + now.second() * 1000);
  if (diff < 0) {
    diff = diff + 24 * 60 * 60 * 1000;
  }

  console.log(diff);

  stopTimeout = setTimeout(() => {
    console.log('stoped');
  }, diff);
};

export const start = () => {
  const queue = store.getState().queue;
  if (!queue.status) {
    stopJob();
  }
};

export const stop = () => {
  clearTimeout(stopTimeout);
};
