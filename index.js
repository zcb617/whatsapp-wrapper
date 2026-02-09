const { app, BrowserWindow, Menu, Tray, Notification } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

// 伪装成 Chrome 浏览器
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'WhatsApp',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      userAgent: userAgent,
      partition: 'persist:whatsapp'
    }
  });

  mainWindow.webContents.setUserAgent(userAgent);

  // 加载 WhatsApp Web
  mainWindow.loadURL('https://web.whatsapp.com');

  // 页面加载完成后注入反检测
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      Object.defineProperty(window, 'Electron', { value: undefined });
      Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      });
      Object.defineProperty(window, 'webkit', { value: undefined });
      Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
    `).catch(() => {});
  });

  // 窗口关闭时隐藏
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // 未读消息通知
  mainWindow.on('page-title-updated', (event, title) => {
    if (title.includes('(') && title.includes(')') && !title.includes('WhatsApp')) {
      const match = title.match(/\((\d+)\)/);
      if (match) {
        showNotification('WhatsApp', `有 ${match[1]} 条未读消息`);
      }
    }
  });

  // 无应用菜单（顶部栏）
  Menu.setApplicationMenu(null);
}

function createTray() {
  try {
    // 使用系统自带的消息图标
    const iconPath = '/usr/share/icons/hicolor/16x16/apps/system-mail.png';
    
    if (require('fs').existsSync(iconPath)) {
      tray = new Tray(iconPath);
    } else {
      // 尝试其他常见图标路径
      const possibleIcons = [
        '/usr/share/icons/Adwaita/16x16/status/message.png',
        '/usr/share/icons/hicolor/16x16/status/dialog-information.png',
        '/usr/share/pixmaps/gnome-monitor.png',
      ];
      
      for (const p of possibleIcons) {
        if (require('fs').existsSync(p)) {
          tray = new Tray(p);
          break;
        }
      }
    }

    if (!tray) {
      // 如果都没找到，用内置方式创建
      tray = new Tray(path.join(__dirname, 'icon.png'));
    }

    tray.setToolTip('WhatsApp');

    // 右键菜单
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示窗口', click: () => { mainWindow.show(); mainWindow.focus(); } },
      { label: '刷新', click: () => { mainWindow.reload(); } },
      { type: 'separator' },
      { label: '退出', click: () => { app.isQuitting = true; app.quit(); } }
    ]);

    tray.setContextMenu(contextMenu);

    // 单击显示/隐藏
    tray.on('click', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    console.log('Tray initialized successfully');
  } catch (e) {
    console.log('Tray not available:', e.message);
  }
}

function showNotification(title, body) {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: title,
      body: body,
      silent: false
    });
    notification.show();
    notification.on('click', () => {
      mainWindow.show();
      mainWindow.focus();
    });
    setTimeout(() => notification.close(), 5000);
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});