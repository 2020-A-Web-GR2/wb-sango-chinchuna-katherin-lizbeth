import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Header,
    HttpCode,
    Param,
    Post,
    Query,
    Req, Res
} from "@nestjs/common";
import {MascotaCreateDto} from "./dto/mascota.create-dto";
import {validate, ValidationError} from "class-validator";

//Para levantar el servidor npm run start

// URL hasta ahora esta: http://localhost:3001/juegos-http
@Controller('/juegos-http') //segmento ed la URL
export class HttpJuegoController {
    @Get('hola')
    @HttpCode(201)
    holaGet(){
        throw new BadRequestException('No envia nada');
        //return 'Hola GET! :)';
    }
    @Post('hola')
    @HttpCode(202)
    holaPost(){
        return 'Hola Post! :)';
    }
    @Delete('hola')
    @Header('Cache-control','none')
    @Header('EPN','Probando las cosas')
    @HttpCode(204)
    holaDelete(){
        return 'Hola Delete! :)';
    }
    //URL de este GET: http://localhost:3001/juegos-http/parametros-ruta/XX/gestion/YY
    @Get('/parametros-ruta/:edad/gestion/:altura') //cuando queremos recibir debemos poner : y luego los parametros.
    parametrosRutaEjemplo(
        @Param() parametrosRuta
    ){
        console.log('Parametros',parametrosRuta);

        //Validad que la edad y la altura son numeros
        //isNaN(parametrosRuta.edad); //'ABC' true
        //isNaN(parametrosRuta.altura); // 1234 false
        if (!isNaN(parametrosRuta.edad) && !isNaN(parametrosRuta.altura)){
            console.log('Son numeros');
            const edad = Number(parametrosRuta.edad);
            const altura = Number(parametrosRuta.altura);
            return edad + altura;
        }else{
            throw new BadRequestException('No son numeros');
        }
    }

    //URL de este GET: http://localhost:3001/juegos-http/parametros-consulta?nombre=Adrian&apellido=Eguez
    /*@Get('parametros-consulta')
    parametrosConsulta(
        @Query() parametrosDeConsulta
    ){
        if (parametrosDeConsulta !== null){
            console.log('parametros de consulta', parametrosDeConsulta);
        }
        console.log('=)');
        return '=)';
    }*/
    @Get('parametros-consulta')
    parametrosConsulta(
        @Query() parametrosDeConsulta
    ){
        const tieneNombreyApellido = parametrosDeConsulta.nombre && parametrosDeConsulta.apellido;
        console.log('parametros de consulta', parametrosDeConsulta);

        if (tieneNombreyApellido){  //en JS solo ponemos el parametro para saber si es undefined o no en un if
            return parametrosDeConsulta.nombre + ' ' + parametrosDeConsulta.apellido;
        }else{
            return '=)';
        }
    }

    //Validaciones
    @Post('parametros-cuerpo')
    @HttpCode(200)
    async parametrosCuerpo(
        @Body() parametrosDeCuerpo
    ){
        //promesa
        const mascotaValida = new MascotaCreateDto();
        mascotaValida.nombre = parametrosDeCuerpo.nombre;
        mascotaValida.edad = parametrosDeCuerpo.edad;
        mascotaValida.casada = parametrosDeCuerpo.casada;
        mascotaValida.ligada = parametrosDeCuerpo.ligada;
        mascotaValida.peso = parametrosDeCuerpo.peso;

        //Aqui validamos las propiedades
        try {

            const  errores: ValidationError[] = await validate(mascotaValida);
            if (errores.length > 0){
                console.log('Errores',errores);
                throw new BadRequestException('Error validando');
            }else {
                const mensajeCorrecto = {
                    mensaje: 'Se creo correctamente'
                };
                return mensajeCorrecto;
            }

        }catch (e) {
            console.log('Error', e);
            throw new BadRequestException('Error validando');
        }

    }

    //Cookies
    //1. Guardar una cookie insegura
    @Get('guardarCookieInsegura')
    guardarCookieInsegura(
        @Query() parametrosConsulta,
        @Req() req, //request - PETICION
        @Res() res //response - RESPUESTA
    ){
        res.cookie(
            'galletaInsegura', //nombre
            'Tengo hambre', //valor
        );

        const mensaje = {
            mensaje:'OK'
        }
        //No se puede usar un return cuando se usa un @RES, metodo del express JS
        res.send(mensaje )
    }

    //2. Guardar una cookie segura
    @Get('guardarCookieSegura')
    guardarCookieSegura(
        @Query() parametrosConsulta,
        @Req() req, //request - PETICION
        @Res() res //response - RESPUESTA
    ){
        res.cookie(
            'galletaSegura', //nombre
            'Web :3', //valor
            {
                secure: true
            }
        );

        const mensaje = {
            mensaje:'OK'
        }
        //No se puede usar un return cuando se usa un @RES, metodo del express JS
        res.send(mensaje )
    }

    //3. Mostrar cookies
    @Get('mostrarCookies')
    mostrarCookies(
        @Req() req
    ) {
        const mensaje = {
            sinFirmar: req.cookies,
            firmadas: req.signedCookies
        };
        return mensaje;
    }

    //Cookies firmadas
    @Get('guardarCookieFirmada')
    public guardarCookieFirmada(
        @Res() res
    ) {
        res.cookie('firmada', 'poliburguer', { signed : true });
        /*res.cookie('firmada1', 'poliburguer1', {signed: true});
        res.cookie('firmada2', 'poliburguer2', {signed: true});
        res.cookie('firmada3', 'poliburguer3', {signed: true});
        res.cookie('firmada4', 'poliburguer4', {signed: true});*/
        const mensaje = {
            mensaje: 'ok'
        };
        res.send(mensaje);
    }
}

