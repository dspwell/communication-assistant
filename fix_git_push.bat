@echo off
chcp 65001 >nul
cd /d F:\AIship\code\communication-assistant

echo 🔄 清除嵌套 Git 仓库: communication-assistant/.git
rmdir /s /q communication-assistant\.git

echo ✅ 已删除子仓库 Git 配置
echo 📦 添加所有项目文件到 Git 暂存区
git add .

echo 📝 提交更改
git commit -m "fix: remove embedded git repo and re-add as normal folder"

echo 🚀 推送到 GitHub main 分支
git push origin main

echo ✅ 完成！代码已推送，可前往 GitHub 或 Vercel 查看部署进度。
pause
