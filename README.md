# ALFA CORPORATE - ANDROID PAYLOAD (APK)
Este repositório contém o código-fonte do agente de monitoramento Android para o ecossistema **Alfa Security**.

## 🚀 Funcionalidades
- **Persistência de Elite:** Foreground Service que impede o encerramento do app pelo sistema.
- **Rastreamento GPS:** Monitoramento de localização em tempo real com integração ao Firebase.
- **Auto-Início:** Inicia automaticamente ao ligar o dispositivo.
- **Sistema de Comandos:** Execução de comandos remotos via Dashboard Web.
- **Build Automatizado:** O APK é gerado automaticamente via GitHub Actions.

## 🛠️ Como Gerar o APK
1. Faça o commit deste código para a sua branch `main`.
2. Vá até a aba **Actions** no GitHub.
3. Clique no workflow **Build Android APK (Corporate)**.
4. Após o término, o APK estará disponível nos **Artifacts**.

## 🛡️ Configuração Firebase
Certifique-se de atualizar as credenciais no arquivo `App.js` antes de realizar o build.

---
*Este software é destinado a fins de auditoria e compliance corporativo.*
