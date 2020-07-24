import {Controller, Get, HttpCode, Param, Put, Query} from "@nestjs/common";

@Controller('deber01')
export class Deber01Controller {

    /*SUMAR (n1 + n2)
    GET
    200
    QUERY (n1)
    HEADERS, RUTA, QUERY, (n2)*/
    @Get('/suma/:n2')
    @HttpCode(200)
    suma(
        @Query() n1,
        @Param() n2
    ){
        console.log('N1= ',n1)
        console.log('N2= ',n2)
    }

    /*RESTA (n1 - n2)
    PUT
    201
    BODY (n1)
    HEADERS, RUTA, QUERY, BODY (n2)*/
    @Put()
    resta(){

    }

    /*MULTIPLICACION (n1 * n2)
    DELETE
    200
    HEADERS (n1)

    HEADERS, RUTA, QUERY, BODY (n2)*/



    /*DIVISION (n1 / n2)
    POST
    201
    RUTA (n1)

    HEADERS, RUTA, QUERY, BODY (n2)*/




}