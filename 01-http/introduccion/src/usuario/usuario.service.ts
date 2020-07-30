import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsuarioService {
    constructor( //inyeccion de dependencias
        @InjectRepository(UsuarioEntity)
        private reposiorio: Repository<UsuarioEntity>
    ) {
    }
    crearUno(nuevoUsuario:UsuarioEntity){
        return this.reposiorio.save(nuevoUsuario)
    }
}