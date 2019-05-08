import store from 'Root/store';
import fetch from 'Root/helpers/fetch';
import update from 'Root/actions/downloads/update';
import complete from 'Root/actions/downloads/complete';
import resume from 'Root/actions/queue/resume';
import fail from 'Root/actions/downloads/fail';

export default () => {
  const job = async () => {
    const downloads = store.getState().downloads.filter(
      item => item.downloadStatus === 'downloading',
    );

    const actions = downloads.map(download => new Promise(async (resolve) => {
      const res = await fetch({
        method: 'aria2.tellStatus',
        params: [
          download.gid,
        ],
      });

      if (!res) {
        await fail(download.id);
        if (download.queue) {
          resume();
        }
      } else {
        update(download.id, res.result);
        if (res.result.totalLength === res.result.completedLength) {
          await complete(download.id);
          if (download.queue) {
            resume();
          }
        }
      }

      resolve();
    }));

    await Promise.all(actions);

    setTimeout(job, 500);
  };

  job();
};
