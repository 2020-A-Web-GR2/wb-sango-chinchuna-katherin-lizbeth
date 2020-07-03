import {BadRequestException, Controller, Delete, Get, Header, HttpCode, Param, Post} from "@nestjs/common";


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
}

