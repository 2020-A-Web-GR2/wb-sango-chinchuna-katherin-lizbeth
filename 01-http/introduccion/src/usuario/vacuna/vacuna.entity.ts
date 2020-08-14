import {Column, Entity, PrimaryGeneratedColumn} from "typeorm/index";
import {ManyToOne} from "typeorm/index";
import {MascotaEntity} from "../mascota/mascota.entity";

@Entity('db_vacuna')
export class VacunaEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    //Relaciones
    @ManyToOne(
        type => MascotaEntity,
        mascota => mascota.vacunas
    )
    mascota: MascotaEntity;

}