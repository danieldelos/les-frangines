# 🇫🇷 Les Frangine - Plataforma de Ensino de Francês Online

![Stack](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

Plataforma completa para gestão de escola online de francês com videoaulas, agendamento inteligente de aulas via Zoom, repositório pedagógico compartilhado e controle financeiro integrado ao Asaas.

## ✨ Funcionalidades

- **Gestão de usuários** com 3 roles: administrador, professor e aluno
- **Repositório pedagógico** compartilhado entre professor e aluno
- **Agendamento inteligente** de aulas com:
  - Visualização de slots disponíveis em tempo real
  - Regra de cancelamento (3h de antecedência)
  - Integração automática com Zoom API
  - Sugestão de novos horários após cancelamento
- **Módulo financeiro** com:
  - Integração com API Asaas (cobranças recorrentes)
  - Importação de extrato bancário
  - Dashboards de ticket médio e fluxo de caixa
- **Notificações** automáticas por email (agendamentos, cancelamentos, novos materiais)

## 🛠 Stack Técnica

### Backend
- Python 3.11+
- Django 5 + Django REST Framework
- PostgreSQL (via Supabase)
- Autenticação JWT

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

### Infraestrutura
- Supabase (banco de dados + storage)
- Railway (deploy backend)
- Vercel (deploy frontend)

## 📁 Estrutura do Projeto
