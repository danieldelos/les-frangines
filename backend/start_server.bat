@echo off
echo Ativando ambiente virtual e iniciando Django server...
cd /d "%~dp0"
call .\venv\Scripts\activate.bat
python manage.py runserver
echo Servidor Django iniciado!