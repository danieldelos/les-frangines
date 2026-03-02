# Solução para Autenticação Google

## Problema
O Django está rodando com Python global, mas o `google-auth` está instalado no ambiente virtual `venv`.

## Solução

### Opção 1: Usar scripts de inicialização (Recomendado)

**Windows (PowerShell):**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

**Windows (CMD):**
```cmd
cd backend
.\venv\Scripts\activate.bat
python manage.py runserver
```

**Linux/Mac:**
```bash
cd backend
source .venv/bin/activate  # ou .venv/Scripts/activate no Git Bash
python manage.py runserver
```

### Opção 2: Usar scripts criados

**Windows:**
```cmd
cd backend
start_server.bat
```

**Linux/Mac:**
```bash
cd backend
./start_server.sh
```

### Opção 3: Configurar VS Code para usar venv

1. Abra a paleta de comando (Ctrl+Shift+P)
2. Selecione "Python: Select Interpreter"
3. Escolha o interpretador do venv: `.venv\Scripts\python.exe`

### Verificação

Para confirmar que está funcionando:
```bash
# Com venv ativado
python -c "from google.auth.transport import requests; from google.oauth2 import id_token; print('✅ Google auth funcionando!')"
```

## ⚠️ Alerta Importante
Sempre ative o ambiente virtual antes de rodar comandos Django:
- `python manage.py migrate`
- `python manage.py runserver`
- `python manage.py createsuperuser`

Caso contrário, o Django usará o Python global sem as dependências instaladas.