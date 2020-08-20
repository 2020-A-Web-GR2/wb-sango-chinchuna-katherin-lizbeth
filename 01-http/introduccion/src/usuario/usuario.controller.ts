import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException, NotFoundException,
    Param,
    Post,
    Put, Res
} from '@nestjs/common';
import {UsuarioService} from "./usuario.service";
import {UsuarioCreateDto} from "./dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioUpdateDto} from "./dto/usuario.update-dto";
import {MascotaService} from "./mascota/mascota.service";

@Controller('usuario')
export class UsuarioController {
    public arregloUsuarios = [
        {
            id: 1,
            nombre: 'Katherin'
        },
        {
            id: 2,
            nombre: 'Lizbeth'
        },
        {
            id: 3,
            nombre: 'Adrian'
        }
    ]
    public idActual = 3;

    constructor(
        private readonly _usuarioService: UsuarioService,
        private readonly _mascotaService: MascotaService,
    ) {

    }

    // ************ Metodos CRUD ************
    //Mostrar todos
    @Get()
    async mostrarTodos() {
        try {
            const respuesta = await this._usuarioService.buscarTodos();
            return respuesta;
        }catch (e) {
            console.error(e);
            throw new InternalServerErrorException({
                mensaje: 'Error del servidor',
            })
        }
    }

    //Crear uno
    @Post()
    async crearUno(
        @Body() parametrosCuerpo
    ) {
        try {
            //Validacion del create DTO
            const usuarioValido = new UsuarioCreateDto();
            usuarioValido.nombre = parametrosCuerpo.nombre;
            usuarioValido.apellido = parametrosCuerpo.apellido;
            usuarioValido.cedula = parametrosCuerpo.cedula;
            usuarioValido.sueldo = parametrosCuerpo.sueldo;
            usuarioValido.fechaNacimiento = parametrosCuerpo.fechaNacimiento;
            usuarioValido.fechaHoraNacimiento = parametrosCuerpo.fechaHoraNacimiento;

            //validar propiedades

                const  errores: ValidationError[] = await validate(usuarioValido);
                if (errores.length > 0){
                    console.log('Errores',errores);
                    throw new BadRequestException('Error validando');
                }else {
                    const respuesta = await this._usuarioService.crearUno(parametrosCuerpo);
                    console.log('Datos usuario nuevo: ',usuarioValido);
                    return respuesta;
                }

        }catch (e) {
            console.error(e);
            throw new BadRequestException({
                mensaje: 'Error validando datos'
            })
        }
    }

    //Ver uno
    @Get(':id')
    async verUno(
        @Param() parametrosRuta
    ){
        let respuesta;
        try {
            respuesta = await this._usuarioService.buscarUno(Number(parametrosRuta.id));

        }catch (e) {
            console.error(e);
            throw new InternalServerErrorException({
                mensaje: 'Error del servidor',
            })
        }
        if (respuesta)
            return respuesta;
        else
        {
            throw new NotFoundException({
                mensaje: 'No existen registros'
            })
        }
    }

    //Editar Uno
    @Put(':id')
    async editarUno(
        @Param() parametrosRuta,
        @Body() parametrosCuerpo
    ){
        const id = Number(parametrosRuta.id);
        const usuarioEditado = parametrosCuerpo;
        usuarioEditado.id = id;

        let errores: ValidationError[];
        let respuesta;
        try {

            //Validacion del create DTO
            const usuarioUpdate = new UsuarioUpdateDto();
            usuarioUpdate.nombre = usuarioEditado.nombre;
            usuarioUpdate.apellido = usuarioEditado.apellido;
            usuarioUpdate.sueldo = usuarioEditado.sueldo;
            usuarioUpdate.fechaNacimiento = usuarioEditado.fechaNacimiento;
            usuarioUpdate.fechaHoraNacimiento = usuarioEditado.fechaHoraNacimiento;

            //validar propiedades

                errores = await validate(usuarioUpdate);
                if (errores.length > 0){
                    console.log('Errores',errores);
                }else {
                    respuesta = await this._usuarioService.editarUno(usuarioEditado);
                    console.log('Datos usuario actuallizar: ',usuarioUpdate);
                    return respuesta;
                }

        }catch (e) {
            console.error(e);
            throw new InternalServerErrorException({
                mensaje: 'Error del servidor',
            })
        }
        if (!respuesta || errores.length > 0){
            throw new NotFoundException({
                mensaje: 'Error validando'
            })
        }

    }

    //Eliminar uno
    @Delete(':id')
    async eliminarUno(
        @Param() parametrosRuta
    ){
        const id = Number(parametrosRuta.id);
        try {
            const respuesta = await this._usuarioService.eliminarUno(id);
            return {
                mensaje: 'Registro con id ' + id + ' eliminado'
            };

        }catch (e) {
            console.error(e);
            throw new InternalServerErrorException({
                mensaje: 'Error del servidor',
            })
        }
    }

    //crear usuario con mascota
    @Post('crearUsuarioYCrearMascota')
    async crearUsuarioYCrearMascota(
        @Body() parametrosCuerpo
    ) {
        const usuario = parametrosCuerpo.usuario;
        const mascota = parametrosCuerpo.mascota;
        //Validar Usuario
        //Validar mascota
        //CREAMOS LOS DOS
        let usuarioCreado;
        try {
            usuarioCreado = await this._usuarioService.crearUno(usuario);
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException({
                mensaje: 'Error creando usuario',
            })
        }

        if (usuarioCreado) {
            mascota.usuario = usuarioCreado.id;
            let mascotaCreada;
            try {
                mascotaCreada = await this._mascotaService.crearNuevaMascota(mascota);
            } catch (e) {
                console.error(e);
                throw new InternalServerErrorException({
                    mensaje: 'Error creando mascota',
                })
            }

            if (mascotaCreada) {
                return {
                    mascota: mascotaCreada,
                    usuario: usuarioCreado
                }
            } else {
                throw new InternalServerErrorException({
                    mensaje: 'Error creando mascota',
                })
            }

        } else {
            throw new InternalServerErrorException({
                mensaje: 'Error creando mascota',
            })
        }
    }

    //views
    //para usar ejs -> npm install ejs
    @Get('vista/usuario')
    vistaUsuario(
        @Res() res
    ){
        const nombreControlador = 'Katherin';
        res.render(
            'ejemplo', //nombre de la vista (archivo)
            { //Parametros de la vista (opcionales)
                nombre: nombreControlador,
            }
        )
    }



    // XML <usuario><nombre>ADRIAN</nombre></usuario>
    // JSON {"nombre":"ADRIAN"}
    // RESTful - JSON
    // http://localhost:3001/
    // RESTFUL MASCOTA
    // Ver Todos
    // GET http://localhost:3001/mascota
    // Ver Uno
    // GET http://localhost:3001/mascota/1
    // Crear Uno
    // POST http://localhost:3001/mascota (BODY) {"nombre":"cachetes"}
    // Editar Uno
    // PUT http://localhost:3001/mascota/1 (BODY) {"nombre":"panda"}
    // Eliminar Uno
    // DELETE http://localhost:3001/mascota/1
}