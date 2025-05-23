# 🌸 Clínica Estética Gisele Carvalho 🌸

Bem-vindo ao repositório oficial da Clínica Estética Gisele Carvalho! Este projeto é a plataforma online para divulgar nossos produtos e serviços, oferecendo uma experiência de compra e agendamento intuitiva e eficaz. Desenvolvido com **React** e **Vite**, o site é otimizado para performance e uma excelente experiência do usuário.

## ✨ Visão Geral do Projeto

A Clínica Estética Gisele Carvalho é um e-commerce e catálogo de serviços que permite aos clientes:

* Explorar uma variedade de produtos de beleza e bem-estar.
* Visualizar um produto em destaque na página inicial.
* Adicionar produtos ao carrinho de compras.
* Realizar pagamentos de forma segura via Mercado Pago.
* Conhecer os diversos serviços estéticos oferecidos pela clínica.
* Administrar produtos e visualizar pedidos através de um painel administrativo seguro.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com um stack moderno e robusto:

**Frontend:**
* **React 19.1.0**: Biblioteca JavaScript para construção de interfaces de usuário.
* **Vite 6.3.5**: Ferramenta de build frontend que oferece uma experiência de desenvolvimento extremamente rápida.
* **Tailwind CSS 4.1.6**: Framework CSS utilitário para estilização rápida e responsiva.
* **Framer Motion 12.12.1**: Biblioteca para animações e interações fluidas.
* **React Router DOM 7.6.0**: Para navegação e roteamento dentro da aplicação.
* **Heroicons 2.2.0 & React Icons 5.5.0**: Coleções de ícones para uma interface visual agradável.
* **Mercado Pago SDK React 1.0.3**: Integração facilitada com a API do Mercado Pago para pagamentos.

**Backend (Firebase & Cloud Functions):**
* **Firebase**: Plataforma de desenvolvimento de aplicativos do Google, utilizada para:
    * **Firestore**: Banco de dados NoSQL para armazenar produtos e pedidos.
    * **Firebase Authentication**: Gerenciamento de autenticação de usuários (para o painel administrativo).
    * **Firebase Storage**: Armazenamento de imagens dos produtos.
    * **Firebase Functions (Node.js 20)**: Funções serverless para processamento de pagamentos com Mercado Pago.
* **Mercado Pago (SDK Node.js 2.7.0)**: Processamento de pagamentos. As funções são configuradas para usar secrets do Secret Manager para as chaves de acesso (produção e teste), com um fallback para o token de teste em ambiente de emulador.
* **Cloudinary**: Serviço de gerenciamento de imagens, integrado para upload e otimização das imagens dos produtos.

## ⚙️ Configuração e Instalação

Siga estes passos para configurar e rodar o projeto localmente:

### Pré-requisitos

* Node.js (versão 20 ou superior recomendada)
* npm (gerenciador de pacotes do Node.js)
* Conta Firebase (com Firestore, Authentication, Storage e Functions ativados)
* Conta Mercado Pago (com credenciais de teste e produção)
* Conta Cloudinary

### Passos de Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/eduardo-juricic/clinica-estetica.git](https://github.com/eduardo-juricic/clinica-estetica.git)
    cd clinica-estetica
    ```

2.  **Instale as dependências do Frontend:**
    ```bash
    npm install
    ```

3.  **Configure o Firebase no Frontend:**
    Crie um arquivo `.env` na raiz do projeto (mesmo nível de `package.json`) e adicione suas credenciais do Firebase e a Public Key do Mercado Pago:

    ```env
    VITE_FIREBASE_API_KEY="Sua_ApiKey_Firebase"
    VITE_FIREBASE_AUTH_DOMAIN="Seu_AuthDomain_Firebase"
    VITE_FIREBASE_PROJECT_ID="Seu_ProjectId_Firebase"
    VITE_FIREBASE_STORAGE_BUCKET="Seu_StorageBucket_Firebase"
    VITE_FIREBASE_MESSAGING_SENDER_ID="Seu_MessagingSenderId_Firebase"
    VITE_FIREBASE_APP_ID="Seu_AppId_Firebase"
    VITE_MERCADO_PAGO_PUBLIC_KEY="Sua_PublicKey_Mercado_Pago_Frontend"
    ```
    *Certifique-se de que `VITE_MERCADO_PAGO_PUBLIC_KEY` corresponde à sua chave pública do Mercado Pago, que começa com `APP_USR` ou `TEST_USR`.*

4.  **Configure o Cloudinary no Frontend (Opcional, se você já configurou no Admin via Firestore):**
    As configurações do Cloudinary podem ser gerenciadas diretamente pelo painel administrativo (Admin.jsx) via Firestore (coleção `config`, documento `cloudinary`).
    Se precisar configurar via código, edite `src/cloudinaryConfig.js`:
    ```javascript
    // src/cloudinaryConfig.js
    import { v2 as cloudinary } from "cloudinary";

    cloudinary.config({
      cloud_name: "SEU_CLOUD_NAME",
      api_key: "SUA_API_KEY",
      api_secret: "SEU_API_SECRET",
    });

    export default cloudinary;
    ```
    *Recomendamos gerenciar isso via Firestore para maior flexibilidade sem deploy de código.*

5.  **Configure o Backend (Firebase Functions):**
    Navegue até a pasta `functions`:
    ```bash
    cd functions
    npm install
    ```

6.  **Configure as variáveis de ambiente das Functions:**
    No Firebase, você deve usar o Secret Manager para armazenar as chaves de acesso do Mercado Pago de forma segura.
    ```bash
    firebase functions:secrets:set MERCADOPAGO_ACCESS_TOKEN_PROD
    # Cole sua chave de produção quando solicitado
    firebase functions:secrets:set MERCADOPAGO_ACCESS_TOKEN_TEST
    # Cole sua chave de teste quando solicitado
    ```
    No arquivo `functions/index.js`, o código já está preparado para ler essas secrets.

    *A `YOUR_PROVIDED_TEST_ACCESS_TOKEN` no `index.js` serve como fallback para o emulador local caso a secret `MERCADOPAGO_ACCESS_TOKEN_TEST` não esteja configurada ou acessível no ambiente do emulador. Para produção, é **crucial** que `MERCADOPAGO_ACCESS_TOKEN_PROD` esteja corretamente configurada via Secret Manager.*

7.  **Defina a URL do Webhook do Mercado Pago para o ambiente de desenvolvimento:**
    No arquivo `.env` da raiz do projeto, adicione:
    ```env
    VITE_MERCADO_PAGO_WEBHOOK_URL="SUA_URL_DA_FUNCAO_WEBHOOK_DO_FIREBASE_DEPLOYADA"
    ```
    *Esta URL será a URL pública da sua função `processPaymentNotification` após o deploy.*

### Como Rodar o Projeto

#### Frontend
Para iniciar o servidor de desenvolvimento do frontend:
```bash
npm run dev
