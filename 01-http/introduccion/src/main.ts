import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';// Importar cosas en TS
const cookieParser = require('cookie-parser');  // Importar cosas en JS

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //nmp run start:dev
  /*
  * AQUI CONFIGURACION
  * ANTES DEL APP.LISTE()
  * */
  app.use(cookieParser());
  await app.listen(3001);


}
bootstrap();
