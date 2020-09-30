import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('db_materia')
export class MateriaEntity{

    @PrimaryGeneratedColumn({
        unsigned: true,
        name: 'id',
        comment: 'identificador'
    })
    id: number

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: '60'
    })
    nombre: string

    @Column({
        name: 'codigo',
        type: 'varchar',
        length: '20',
        unique: true
    })
    codigo: string

    @Column({
        name: 'paralelo',
        type: 'varchar',
        length: '10'
    })
    paralelo: string  //GR1 - GR2

    @Column({
        name: 'horario',
        type: 'varchar',
        length: '10',
        nullable: true
    })
    horario: string

    @Column({
        name: 'periodo',
        type: 'varchar',
        length: '10'
    })
    periodo: string
}