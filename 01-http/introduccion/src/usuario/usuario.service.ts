import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {Repository} from "typeorm";

//https://typeorm.io/#/find-options

@Injectable()
export class UsuarioService {
    constructor( //inyeccion de dependencias
        @InjectRepository(UsuarioEntity)
        private repositorio: Repository<UsuarioEntity>
    ) {
    }
    crearUno(nuevoUsuario:UsuarioEntity){
        return this.repositorio.save(nuevoUsuario) //devuelve una promesa
    }

    buscarTodos(){
        return this.repositorio.find() //promesa
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id) //promesa
    }

    editarUno(usuarioEditado: UsuarioEntity){
        return this.repositorio.save(usuarioEditado);
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id);
    }
}