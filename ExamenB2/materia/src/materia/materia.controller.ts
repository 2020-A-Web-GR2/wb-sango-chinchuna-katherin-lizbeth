import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post, Put, Query, Req, Res, Session
} from "@nestjs/common";
import {MateriaService} from "./materia.service";
import {MateriaCreateDto} from "./dto/materia.create-dto";
import {validate, ValidationError} from "class-validator";
import {MateriaUpdateDto} from "./dto/materia.update-dto";
import {MateriaEntity} from "./materia.entity";

@Controller('/materia')
export class MateriaController{

    constructor(
        private readonly _materiaService: MateriaService
    ) {
    }
    //clase 12 validaciones

    @Get('ejemplo')
    ejemplo(){
        return 'HOLA'
    }

    @Get()
    async mostrarTodos() {
        try {
            const respuesta = await this._materiaService.buscarTodos();
            return respuesta;
        }catch (e) {
            console.error(e);
            throw new InternalServerErrorException({
                mensaje: 'Error del servidor',
            })
        }
    }

    //crear materia
    @Post()
    async crearUno(
        @Body() parametrosCuerpo
    ){
        try {
            const materiaValida = new MateriaCreateDto();
            materiaValida.nombre = parametrosCuerpo.nombre;
            materiaValida.codigo = parametrosCuerpo.codigo;
            materiaValida.paralelo = parametrosCuerpo.paralelo;
            materiaValida.horario = parametrosCuerpo.horario;
            materiaValida.periodo = parametrosCuerpo.periodo;

            const  errores: ValidationError[] = await validate(materiaValida);
            if (errores.length > 0){
                console.log('Errores',errores);
                throw new BadRequestException('Error validando');
            }else {
                const respuesta = await this._materiaService.crearUno(parametrosCuerpo);
                console.log('Datos materia nueva: ',materiaValida);
                return respuesta;
            }
        }
        catch (e) {
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
            respuesta = await this._materiaService.buscarUno(Number(parametrosRuta.id));

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
        const materiaEditada = parametrosCuerpo;
        materiaEditada.id = id;

        let errores: ValidationError[];
        let respuesta;
        try {
            //Validacion del update DTO
            const materiaUpdate = new MateriaUpdateDto()
            materiaUpdate.nombre = materiaEditada.nombre;
            materiaUpdate.horario = materiaEditada.horario;
            materiaUpdate.paralelo = materiaEditada.paralelo;
            materiaUpdate.periodo = materiaEditada.periodo;

            errores = await validate(materiaUpdate);
            if (errores.length > 0){
                console.log('Errores',errores);
            }else {
                respuesta = await this._materiaService.editarUno(materiaEditada);
                console.log('Datos materia actuallizar: ',  materiaUpdate);
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
            const respuesta = await this._materiaService.eliminarUno(id);
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

    //VISTAS  -- clase 22
    @Get('vista/inicio')
    async inicio(
        @Res() res,
        @Session() session,
        @Query() parametrosConsulta
    ){
        const estaLogueado = session.usuario;
        if (estaLogueado){
            let resultadoEncontrado;
            try {
                resultadoEncontrado = await this._materiaService.buscarTodos(parametrosConsulta.busqueda); //nombre de form
            }catch (e) {
                throw new InternalServerErrorException('Error encontrando materias')
            }
            if(resultadoEncontrado){

                res.render(
                    'materias/inicio',
                    {
                        usuario: session.usuario,
                        arregloMaterias: resultadoEncontrado,
                        parametrosConsulta: parametrosConsulta
                    })
            }else {
                throw new NotFoundException('No se encontraron materias')
            }
        }else {
            return res.redirect('/login')
        }
    }

    @Get('vista/crear')
    crearMateriaVista(
        @Query() parametrosConsulta,
        @Res() res
    ) {
        return res.render(
            'materias/crear',
            {
                error: parametrosConsulta.error,
                nombre: parametrosConsulta.nombre,
                codigo: parametrosConsulta.codigo,
                paralelo: parametrosConsulta.paralelo,
                horario: parametrosConsulta.horario,
                periodo: parametrosConsulta.periodo
            }
        )
    }

    @Get('vista/editar/:id')
    async editarUsuarioVista(
        @Query() parametrosConsulta,
        @Param() parametrosRuta,
        @Res() res
    ) {
        const id = Number(parametrosRuta.id)
        let materiaEncontrada;
        try {
            materiaEncontrada = await this._materiaService.buscarUno(id);
        } catch (error) {
            console.error('Error del servidor');
            return res.redirect('/materia/vista/inicio?mensaje=Error buscando materia');
        }
        if (materiaEncontrada) {
            return res.render(
                'materias/crear',
                {
                    error: parametrosConsulta.error,
                    materia: materiaEncontrada
                }
            )
        } else {
            return res.redirect('/materia/vista/inicio?mensaje=Materia no encontrado');
        }
    }

    @Post('crearDesdeVista')
    async crearDesdeVista(
        @Body() parametrosCuerpo,
        @Res() res,
    ) {
        // Validar los datos con DTO
        let consulta;
        let respuestaCreacionMateria;
        let errores: ValidationError[];

        try {
            const materiaValida = new MateriaCreateDto();
            materiaValida.nombre = parametrosCuerpo.nombre;
            materiaValida.codigo = parametrosCuerpo.codigo;
            materiaValida.paralelo = parametrosCuerpo.paralelo;
            materiaValida.horario = parametrosCuerpo.horario;
            materiaValida.periodo = parametrosCuerpo.periodo;

            errores = await validate(materiaValida);

            if (errores.length > 0){
                const mensajeError = 'Datos ingresados invalidos'
                return res.redirect('/materia/vista/crear?error=' + mensajeError);
            }else {
                consulta = `&nombre=${parametrosCuerpo.nombre}&codigo=${parametrosCuerpo.codigo}
                &paralelo=${parametrosCuerpo.paralelo}&horario=${parametrosCuerpo.horario}
                &periodo=${parametrosCuerpo.periodo}`
                respuestaCreacionMateria = await this._materiaService.crearUno(parametrosCuerpo);
            }
        }
        catch (e) {
            console.error(e);
            const mensajeError = 'Error creando materia'
            return res.redirect('/materia/vista/crear?error=' + mensajeError + consulta)
        }

        if (respuestaCreacionMateria) {
            return res.redirect('/materia/vista/inicio');
        } else {
            const mensajeError = 'Error creando materia'
            return res.redirect('/materia/vista/crear?error=' + mensajeError + consulta);
        }
    }

    @Post('editarDesdeVista/:id')
    async editarDesdeVista(
        @Param() parametrosRuta,
        @Body() parametrosCuerpo,
        @Res() res
    ){
        const materiaEditada = {
            id: Number(parametrosRuta.id),
            nombre: parametrosCuerpo.nombre,
            paralelo: parametrosCuerpo.paralelo,
            horario: parametrosCuerpo.horario,
            periodo: parametrosCuerpo.periodo
        } as MateriaEntity;

        let errores: ValidationError[];

        try {
            const materiaUpdate = new MateriaUpdateDto();
            materiaUpdate.nombre = materiaEditada.nombre;
            materiaUpdate.paralelo = materiaEditada.paralelo;
            materiaUpdate.horario = materiaEditada.horario;
            materiaUpdate.periodo = materiaEditada.periodo;

            errores = await validate(materiaUpdate);

            if (errores.length > 0){
                console.log('Errores',errores);
                const mensajeError = 'Datos ingresados invalidos'
                return res.redirect('/materia/vista/inicio?mensaje=' + mensajeError)
            }else {
                await this._materiaService.editarUno(materiaEditada);
                return res.redirect('/materia/vista/inicio?mensaje=Materia editada')
            }
        }catch (e) {
            console.log(e);
            return res.redirect('/materia/vista/inicio?mensaje=Error editando materia')
        }
    }

    @Post('eliminarDesdeVista/:id')
    async eliminarDesdeVista(
        @Param() parametrosRuta,
        @Res() res
    ){
        try {
            const id = Number(parametrosRuta.id);
            await this._materiaService.eliminarUno(id);
            return res.redirect('/materia/vista/inicio?mensaje=Materia eliminada')
        }catch (e) {
            return res.redirect('/materia/vista/inicio?error=Error eliminando materia')
        }
    }

}