#!/usr/bin/env python
import sys

try:
    from google.auth.transport import requests as google_requests
    from google.oauth2 import id_token as google_id_token
    print("✅ Google auth importado com sucesso")
    print(f"google_requests: {google_requests}")
    print(f"google_id_token: {google_id_token}")
except ImportError as e:
    print(f"❌ Erro ao importar google-auth: {e}")
    print(f"Python path: {sys.path}")
except Exception as e:
    print(f"❌ Outro erro: {e}")
    import traceback
    traceback.print_exc()