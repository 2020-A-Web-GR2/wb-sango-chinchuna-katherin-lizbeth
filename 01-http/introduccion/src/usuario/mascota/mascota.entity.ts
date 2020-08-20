import {Entity} from 'typeorm';
import {Column, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm/index';
import {VacunaEntity} from '../vacuna/vacuna.entity';
import {UsuarioEntity} from "../usuario.entity";

@Entity('db_mascota')
export class MascotaEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'nombre', //nombre de la columna
        type: 'varchar',
        length: '60'
    })
    nombre: string;

    @ManyToOne(
        type => UsuarioEntity,
        // Que entidad nos relacionamos
        usuario => usuario.mascotas
        // Campo con el q relacionamos
    )
    usuario: UsuarioEntity;

    @OneToMany(
        type => VacunaEntity,
        vacuna => vacuna.mascota
    )
    vacunas: VacunaEntity[];

}