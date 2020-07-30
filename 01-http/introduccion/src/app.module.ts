import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {HttpJuegoModule} from "./http/http-juego.module";
import {UsuarioModule} from "./usuario/usuario.module";
import {Deber01Module} from "./deber01/deber01.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario/usuario.entity";

@Module({
  imports: [
      // Aqui otros modulos
      HttpJuegoModule,
      Deber01Module,
      UsuarioModule,
      TypeOrmModule
          .forRoot({
          name: 'default', //nombre conexion
          type: 'mysql',  //mysql o postgres
          host: 'localhost', //ip
          port: 3306, //puerto
          username: 'root', //usuario
          password: '4321', //password
          database: 'test', //base de datos
          entities: [
              UsuarioEntity
          ], //TODAS LAS ENTIDADES
          synchronize: true, //Actualiza el esquema de la base de datos
          dropSchema: false, //Elimina Datos y el Esquema de la base de datos
      }),
  ],
  controllers: [
      //Controladores APP MODULE
      AppController
  ],
  providers: [
      //Servicios APP MODULE
      AppService
  ],
})
export class AppModule {}
