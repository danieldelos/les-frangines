#!/bin/bash
echo "Ativando ambiente virtual e iniciando Django server..."
cd "$(dirname "$0")"
source .venv/Scripts/activate
python manage.py runserver