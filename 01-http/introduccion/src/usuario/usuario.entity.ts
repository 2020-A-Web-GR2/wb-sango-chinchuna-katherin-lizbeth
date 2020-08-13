import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Index([
    'nombre',
    'apellido',
    'cedula',
    'fechaNacimiento' //nombres de las propiedades en las clases, mas no de las columnas
])

//indice compuesto, indices que no permiten que se tenga dos propiedades con valores iguales
/*@Index(
    ['nombre', 'apellido', 'cedula'],
    {unique:true}
)*/

@Entity('db_usuario') //nombre tabla
export class UsuarioEntity{
    @PrimaryGeneratedColumn({ //Columna principal, identificador de un registro de la tabla
        unsigned: true,
        comment: 'Identificador',
        name:'id'
    })
    id:number

    @Column({
        name: 'nombre', //nombre de la columna
        type: 'varchar',
        nullable: true // puede ser nulo
    })
    nombre: string

    @Column({
        name: 'apellido',
        type: 'varchar',
        nullable: true,
        length: '60'
    })
    apellido?: string  //? opcional

    @Column({
        name: 'cedula',
        type: 'varchar',
        nullable:false, // no puede ser nulo
        unique: true, // no puede repetirse
        length: '18' //tamaño
    })
    cedula: string

    @Column({
        name: 'sueldo',
        nullable: true,
        type: 'decimal',
        precision:10, //1000000000.
        scale: 4 //.0001

    })
    sueldo?:number

    @Column({
        name: 'fecha_nacimiento',
        nullable: true,
        type: 'date'

    })
    fechaNacimiento?:string

    @Column({
        name: 'fecha_hora_nacimiento',
        nullable: true,
        type: 'datetime'

    })
    fechaHoraNacimiento?:string


}






