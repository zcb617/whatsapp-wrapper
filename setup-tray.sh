#!/bin/bash
# 安装托盘依赖并修复

# 安装 libappindicator（让 Electron Tray 能显示在顶部状态栏）
sudo apt update
sudo apt install -y libappindicator3-1 gir1.2-appindicator3-0.1 libnotify4

echo "安装完成！现在运行: cd ~/coderepo/whatsapp-wrapper && npm start"