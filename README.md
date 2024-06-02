### Предисловие:

При разработке использовал методологию TDD, все e2e тесты лежат в test. Написал скрипты по развертыванию тестового окружения в package.json  
Все данные провалидировал, написал Guards, кастомные декораторы. Для написания схемы для БД использовал https://dbdiagram.io

<img src="./dbdiagram.png" width="700"/>

### Инструкция по запуску:

```sh
npm i
npm run db:dev:up
npx prisma db push
npm run start

### Запуск тестов
npm run test:e2e  
```

