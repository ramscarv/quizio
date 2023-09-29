## Para rodar este projeto

1. Clone este repostório
2. Instale as dependecias`npm install`
3. Crie um cadastro no google cloud OAuth. Será necessário um url de cliente e secret
4. Comando docker-compose up, para o docker-compose.yml
5. ADD o .env file com DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET,GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
6. Faça o push das migrations`npx prisma db push`
7. Finalmente faça `npm run dev`

## Funcionalidades
1. O banco de dados armazena dados dos usuarios atraves de uma conta google(dados de login)
2. criacao de quiz por usuario
3. Fazer quiz com reporte de erros e acertos(acertou = verde, errou = vermelho)
4. clickou em outra aba, quiz é fechado