import { Tray, Menu } from 'electron';
import { resolve } from 'path';
import shutdown from 'Root/helpers/shutdown';

let tray = null;
export default (getWindow, createWindow, app) => {
  tray = new Tray(resolve(__dirname, '..', 'icons', '256x256.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      type: 'normal',
      click() {
        const win = getWindow();
        if (win) {
          if (win.isMinimized()) {
            win.restore();
          }
          win.focus();
        } else {
          createWindow();
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Close',
      type: 'normal',
      click() {
        shutdown();
        getWindow().close();
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Speedster');
  tray.setContextMenu(contextMenu);
};
