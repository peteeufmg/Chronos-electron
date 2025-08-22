# **Chronos - Sistema de Sensoriamento**

**Chronos** é um sistema de desktop multiplataforma (Windows e macOS) desenvolvido para cronometragem e sensoriamento de competições, como as realizadas pela CoRA (Comissão de Robótica de Alfenas). O sistema foi construído para ser robusto, portátil e fácil de usar, com um backend local para gerenciamento de dados e comunicação com hardware externo via porta serial.

## **Tabela de Conteúdos**

- [Visão Geral](#visão-geral)  
- [Principais Funcionalidades](#principais-funcionalidades)  
- [Tecnologias Utilizadas](#tecnologias-utilizadas)  
- [Documentação](#documentação)  
- [Instalação e Uso](#instalação-e-uso)  
  - [Para Usuários Finais (Versão Portátil)](#para-usuários-finais-versão-portátil)  
  - [Para Desenvolvedores](#para-desenvolvedores)  
- [Estrutura do Projeto](#estrutura-do-projeto)  
- [Autor](#autor)

## **Visão Geral**

O Chronos foi projetado para centralizar o gerenciamento de competições de robótica. Ele utiliza o framework **Electron** para criar uma aplicação de desktop robusta com tecnologias web. Internamente, ele executa um servidor **Express.js** para fornecer uma API local e se comunica com um banco de dados **SQLite**, garantindo que a aplicação seja autocontida e os dados sejam totalmente portáteis.  
Uma das características principais é a capacidade de se comunicar com dispositivos externos (como sensores de tempo e Arduinos) através da porta serial, permitindo a captura de dados de forma automatizada e precisa.

## **Principais Funcionalidades**

- **Gerenciamento Completo:** Cadastro de equipes e participantes.  
- **Cronometragem Precisa:** Registro de tempos por etapas, baterias e checkpoints.  
- **Comunicação com Hardware:** Conexão via porta serial para captura de dados em tempo real.  
- **Sorteio de Baterias:** Sistema para realizar sorteios e definir a ordem das equipes nas competições.  
- **Backend Integrado:** API local que garante que a aplicação funcione de forma independente, sem necessidade de internet.  
- **Banco de Dados Portátil e Compartilhado:** Projetado para rodar a partir de um pendrive, compartilhando o mesmo banco de dados entre as versões de Windows e macOS.

## **Tecnologias Utilizadas**

- **Framework Desktop:** [Electron](https://www.electronjs.org/)  
- **Backend:** [Node.js](https://nodejs.org/) com [Express.js](https://expressjs.com/pt-br/)  
- **Banco de Dados:** [SQLite](https://www.sqlite.org/index.html) com o driver [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)  
- **Comunicação com Hardware:** [node-serialport](https://serialport.io/)  
- **Frontend:** HTML, CSS, JavaScript (integrado ao Electron)  
- **Builder:** [Electron Forge](https://www.electronforge.io/)

## **Documentação**

- **API**: [Swagger Editor](https://editor.swagger.io/) Use o API.yaml
- **Base de dados**: [DbDiagram.io](https://dbdiagram.io/d/Back-Chronos-689e0b5a1d75ee360aa3295a)

## **Instalação e Uso**

Existem duas maneiras de utilizar o Chronos: como um usuário final com a versão portátil ou como um desenvolvedor para modificar e compilar o código.

### **Para Usuários Finais (Versão Portátil)**

Esta versão é ideal para levar a competições, pois não requer instalação e pode ser executada diretamente de um pendrive.

1. **Estrutura de Pastas para o Pendrive:**  
   ```
   📁 PENDRIVE/  
   ├── 📁 Chronos_Windows/  
   │   ├── Chronos.exe  
   │   └── (outros arquivos e pastas da aplicação...)  
   │  
   ├── 📁 Chronos_Mac/  
   │   └── Chronos.app  
   │  
   └── 📁 database/  
       └── (o arquivo de banco de dados 'exemple.db' será criado aqui automaticamente)
   ```

2. **Como Executar:**  
   - **No Windows:** Abra a pasta `Chronos_Windows` e dê um duplo clique no arquivo `Chronos.exe`.  
   - **No macOS:** Abra a pasta `Chronos_Mac` e dê um duplo clique no aplicativo `Chronos.app`.  

Ambas as versões acessarão e modificarão o mesmo arquivo de banco de dados localizado na pasta `database`.

### **Para Desenvolvedores**

1. **Pré-requisitos:**  
   - [Node.js](https://nodejs.org/en/) (versão LTS recomendada)  
   - Git  

2. **Clonar o Repositório:**  
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd <NOME_DA_PASTA_DO_PROJETO>
   ```

3. **Instalar Dependências:**  
   ```bash
   cd front & npm install
   cd .. && npm install
   ```

4. **Executar em Modo de Desenvolvimento:**  
   ```bash
   npm start
   ```

5. **Compilar a Aplicação (Build):**  
   ```bash
   npm run make
   ```

   Após a compilação, você encontrará as versões portáteis em `out/make/zip/...` para montar a estrutura do pendrive descrita acima.

## **Estrutura do Projeto**

```
.
├── assets/                 # Ícones e outros recursos visuais  
├── back/                   # Código-fonte do backend (Node.js/Express)  
│   └── src/  
│       ├── controllers/    # Arquivos de controles da API  
│       ├── routes/         # Arquivos de rotas da API  
│       ├── app.js          # Configuração do Express  
│       ├── database.js     # Configuração e inicialização do banco de dados  
│       └── server.js       # Script de inicialização do servidor  
├── front/                  # Código-fonte do frontend  
│   ├── dist/               # Arquivos de build do frontend  
│   └── src/                # Código das páginas
├── electron.js             # Arquivo principal do Electron (processo 'main')  
├── preload.js              # Script de 'preload' para comunicação segura entre processos  
├── forge.config.js         # Configuração do Electron Forge (builder)  
└── package.json            # Dependências e scripts do projeto
```

## **Autor**

- **Julio Teodoro**
