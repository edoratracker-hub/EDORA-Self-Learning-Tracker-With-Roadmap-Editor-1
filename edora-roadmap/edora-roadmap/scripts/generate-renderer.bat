@echo off
echo Generating @roadmapsh/editor renderer bundle for Windows...

if exist "editor" rmdir /s /q editor
if exist ".temp" rmdir /s /q .temp

git clone https://github.com/roadmapsh/web-draw.git .temp\web-draw --depth 1

mkdir packages\editor\dist

xcopy /s /e /i .temp\web-draw\packages\editor\dist packages\editor\
copy .temp\web-draw\packages\editor\package.json packages\editor\

rmdir /s /q .temp

echo pnpm install --no-optional...
pnpm install --no-optional

echo ✅ Renderer generated! Run 'pnpm dev' to test roadmap display.
pause
