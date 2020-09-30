import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Like, Repository} from "typeorm";
import {MateriaEntity} from "./materia.entity";

@Injectable()
export class MateriaService{
    constructor(
        @InjectRepository(MateriaEntity)
        private repositorio: Repository<MateriaEntity>
    ) {
    }

    crearUno(nuevaMateria: MateriaEntity){
        return this.repositorio.save(nuevaMateria);
    }

    buscarTodos(textoDeConsulta?: string){
        const consulta: FindManyOptions<MateriaEntity> ={
            where: [
                {
                    nombre: Like(`%${textoDeConsulta}%`)
                },
                {
                    codigo: Like(`%${textoDeConsulta}%`)
                }
            ]
        }
        return this.repositorio.find(consulta)
    }

    buscarUno(id: number){
        return this.repositorio.findOne(id)
    }

    editarUno(materiaEditada: MateriaEntity){
        return this.repositorio.save(materiaEditada);
    }

    eliminarUno(id: number){
        return this.repositorio.delete(id);
    }
}