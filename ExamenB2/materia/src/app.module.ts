import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MateriaModule} from "./materia/materia.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MateriaEntity} from "./materia/materia.entity";

@Module({
  imports: [
      MateriaModule,
      TypeOrmModule
          .forRoot({
              name: 'default', //nombre conexion
              type: 'mysql',  //mysql o postgres
              host: 'localhost', //ip
              port: 3306, //puerto
              username: 'root', //usuario
              password: '4321', //password
              database: 'examen-web', //base de datos
              entities: [
                MateriaEntity
              ], //TODAS LAS ENTIDADES
              synchronize: true, //Actualiza el esquema de la base de datos
              dropSchema: false, //Elimina Datos y el Esquema de la base de datos
          }),
  ],
  controllers: [
      AppController
  ],
  providers: [
      AppService
  ],
})
export class AppModule {}
