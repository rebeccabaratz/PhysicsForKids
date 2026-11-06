@echo off
rem Запуск игры «Эли и фотон»: двойной щелчок по этому файлу.
rem Поднимает локальный сервер (нужен для озвучки) и открывает игру в браузере.
rem Окно сервера не закрывать, пока играете; закрыть окно — остановить сервер.
cd /d "%~dp0"
curl -s -o nul http://127.0.0.1:8123/ && goto open
start "Eli server" /min python -m http.server 8123 --bind 127.0.0.1
timeout /t 2 /nobreak > nul
:open
start "" http://127.0.0.1:8123/
