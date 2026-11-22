@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:5175/secondary-mathquiz/ in your browser.
node tools/serve.mjs
pause
