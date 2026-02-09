# WhatsApp Linux Wrapper

基于 Electron 的 WhatsApp Web 桌面包装器。

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm start
```

## 打包 DEB

```bash
npm run build:linux
```

生成的文件在 `dist/whatsapp-wrapper_1.0.0_amd64.deb`

## 安装 DEB（已打包）

```bash
cd dist
sudo dpkg -i whatsapp-wrapper_1.0.0_amd64.deb
sudo apt-get install -f  # 修复依赖（如果需要）
```

## 使用方式

- **应用菜单**：在应用列表中搜索 "WhatsApp"
- **命令行**：`whatsapp-wrapper`
- **Dock/任务栏**：点击图标

## 卸载

```bash
# 移除软件包
sudo dpkg -r whatsapp-wrapper

# 清理残留文件
sudo rm -rf /opt/WhatsApp /usr/bin/whatsapp-wrapper /usr/share/applications/whatsapp-wrapper.desktop /usr/share/icons/hicolor/256x256/apps/whatsapp-wrapper.png
```

## 功能

- 系统托盘图标（顶部状态栏 + Dock）
- 最小化到托盘
- 未读消息通知
- 应用菜单（复制、粘贴、刷新等）
- 独立的窗口管理
- 支持系统快捷键
- 反检测伪装（正常加载 WhatsApp Web）

## 注意事项

- 此应用基于 WhatsApp Web，使用前请确保已登录 WhatsApp
- 需要 `--no-sandbox` 参数运行（Linux 环境限制）