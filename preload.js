// Preload script - 安全隔离 + 反检测
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});

// 注入防检测脚本
Object.defineProperty(window, 'Electron', {
  value: undefined,
  writable: true,
  configurable: false
});

// 覆盖 navigator.userAgent
Object.defineProperty(navigator, 'userAgent', {
  get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  set: () => {}
});

// 隐藏 webkit 属性
Object.defineProperty(window, 'webkit', {
  value: undefined,
  writable: true
});

// 删除 navigator.platform (旧版检测)
Object.defineProperty(navigator, 'platform', {
  get: () => 'Win32'
});