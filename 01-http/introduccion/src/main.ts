import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';// Importar cosas en TS
const cookieParser = require('cookie-parser');  // Importar cosas en JS

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //npm run start:dev
  /*
  * AQUI CONFIGURACION
  * ANTES DEL APP.LISTE()
  * */
  app.use(cookieParser('My secret'));
  await app.listen(3001);
}
bootstrap();
