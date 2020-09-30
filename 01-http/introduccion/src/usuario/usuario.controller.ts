import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException, NotFoundException,
    Param,
    Post,
    Put, Query, Res
} from '@nestjs/common';
import {UsuarioService} from "./usuario.service";
import {UsuarioCreateDto} from "./dto/usuario.create-dto";
import {validate, ValidationError} from "class-validator";
import {UsuarioUpdateDto} from "./dto/usuario.update-dto";
import {MascotaService} from "./mascota/mascota.service";
import {UsuarioEntity} from "./usuario.entity";

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

    @Get('vista/faq')
    faq(
        @Res() res
    ){
        res.render('usuario/faq')
    }

    @Get('vista/inicio')
    async inicio(
        @Res() res,
        @Query() parametrosConsulta
    ){
        let resultadoEncontrado;
        try {
            resultadoEncontrado = await this._usuarioService.buscarTodos(parametrosConsulta.busqueda); //nombre de form
        }catch (e) {
            throw new InternalServerErrorException('Error encontrando usuarios')
        }
        if(resultadoEncontrado){
            res.render(
                'usuario/inicio',
                {
                    arregloUsuarios: resultadoEncontrado,
                    parametrosConsulta: parametrosConsulta
                })
        }else {
            throw new NotFoundException('No se encontraron usuarios')
        }
    }

    @Get('vista/login')
    login(
        @Res() res
    ){
        res.render('usuario/login')
    }

    @Get('vista/crear')
    crearUsuarioVista(
        @Query() parametrosConsulta,
        @Res() res
    ) {
        return res.render(
            'usuario/crear',
            {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
                apellido: parametrosConsulta.apellido,
                cedula: parametrosConsulta.cedula
            }
        )
    }

    @Get('vista/editar/:id') // Controlador
    async editarUsuarioVista(
        @Query() parametrosConsulta,
        @Param() parametrosRuta,
        @Res() res
    ) {
        const id = Number(parametrosRuta.id)
        let usuarioEncontrado;
        try {
            usuarioEncontrado = await this._usuarioService.buscarUno(id);
        } catch (error) {
            console.error('Error del servidor');
            return res.redirect('/usuario/vista/inicio?mensaje=Error buscando usuario');
        }
        if (usuarioEncontrado) {
            return res.render(
                'usuario/crear',
                {
                    error: parametrosConsulta.error,
                    usuario: usuarioEncontrado
                }
            )
        } else {
            return res.redirect('/usuario/vista/inicio?mensaje=Usuario no encontrado');
        }

    }

    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() parametrosCuerpo,
        @Res() res,
    ) {
        // Validar los datos con DTO
        //----------------------------------- por lo pronto validamos asi -------------------------------------
        let nombreApellidoConsulta;
        let cedulaConsulta;
        if (parametrosCuerpo.cedula && parametrosCuerpo.nombre && parametrosCuerpo.apellido) {
            nombreApellidoConsulta = `&nombre=${parametrosCuerpo.nombre}&apellido=${parametrosCuerpo.apellido}`
            if (parametrosCuerpo.cedula.length === 10) {
                cedulaConsulta = `&cedula=${parametrosCuerpo.cedula}`
            } else {
                const mensajeError = 'Cedula incorrecta'
                return res.redirect('/usuario/vista/crear?error=' + mensajeError + nombreApellidoConsulta)
            }
        } else {
            const mensajeError = 'Enviar cedula(10) nombre y apellido'
            return res.redirect('/usuario/vista/crear?error=' + mensajeError)
        }
        //-------------------------------------------------------------------------------------------------------

        let respuestaCreacionUsuario;
        try {
            respuestaCreacionUsuario = await this._usuarioService.crearUno(parametrosCuerpo);
        } catch (error) {
            console.error(error);
            const mensajeError = 'Error creando usuario'
            return res.redirect('/usuario/vista/crear?error=' + mensajeError + nombreApellidoConsulta + cedulaConsulta)
        }
        if (respuestaCreacionUsuario) {
            return res.redirect('/usuario/vista/inicio');
        } else {
            const mensajeError = 'Error creando usuario'
            return res.redirect('/usuario/vista/crear?error=' + mensajeError + nombreApellidoConsulta + cedulaConsulta);
        }
    }

    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() parametrosCuerpo,
        @Res() res
    ){
        const usuarioEditado = {
            id: Number(parametrosRuta.id),
            nombre: parametrosCuerpo.nombre,
            apellido: parametrosCuerpo.apellido,
            //cedula: parametrosCuerpo.cedula
        } as UsuarioEntity;
        try {
            await this._usuarioService.editarUno(usuarioEditado);
            return res.redirect('/usuario/vista/inicio?mensaje=Usuario editado')
        }catch (e) {
            console.log(e);
            return res.redirect('/usuario/vista/inicio?mensaje=Error editando usuario')
        }
    }

    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() parametrosRuta,
        @Res() res
    ){
        try {
            const id = Number(parametrosRuta.id);
            await this._usuarioService.eliminarUno(id);
            return res.redirect('/usuario/vista/inicio?mensaje=Usuario elimiando')
        }catch (e) {
            return res.redirect('/usuario/vista/inicio?error=Error eliminando usuario')
        }
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