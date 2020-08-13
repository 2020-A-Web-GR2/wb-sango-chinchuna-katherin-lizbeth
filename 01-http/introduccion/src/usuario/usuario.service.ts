import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {Repository} from "typeorm";

//https://typeorm.io/#/find-options

@Injectable()
export class UsuarioService {
    constructor( //inyeccion de dependencias
        @InjectRepository(UsuarioEntity)
        private reposiorio: Repository<UsuarioEntity>
    ) {
    }
    crearUno(nuevoUsuario:UsuarioEntity){
        return this.reposiorio.save(nuevoUsuario) //devuelve una promesa
    }

    buscarTodos(){
        return this.reposiorio.find() //promesa
    }

    buscarUno(id: number){
        return this.reposiorio.findOne(id) //promesa
    }
}