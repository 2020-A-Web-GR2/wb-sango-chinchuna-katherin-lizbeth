import {
    BadRequestException,
    Delete,
    Get,
    Headers, Post,
    Put,
    Body,
    Controller,
    HttpCode,
    Param,
    Query,
    Req,
    Res
} from "@nestjs/common";
import {isString} from "class-validator";

@Controller('deber01')
export class Deber01Controller {

    nombreRecived: string;
    score: number = 100;

    /*SUMAR (n1 + n2)
    GET
    200
    QUERY (n1)
    HEADERS, RUTA, QUERY, (n2)*/

    //http://localhost:3001/deber01/suma/5
    @Get('/suma/:n2/')
    @HttpCode(200)
    async suma(
        @Query() primerNumero,
        @Param() segundoNumero,
        @Headers() header
    ) {
        /* Extraer cookie de nombreUsuario, en caso que exista se extrae solo el nombre de usuario y se le asigna a la
        * variable nombreRecived*/
        const cookies = header.cookie
        if (cookies){
            this.nombreRecived = cookies.substr(14); //header.cookie='nombreUsuario=username', substr extrae parte de un string
            console.log('usuario:', this.nombreRecived);
        }
        //---------------------------------------------------
        console.log('Suma', primerNumero, segundoNumero);
        if (this.nombreRecived) { //comprobar que el usuario este registrado

            if (!isNaN(primerNumero.n1) && !isNaN(segundoNumero.n2)) { //comprobar que sean numeros

                const result = Number(primerNumero.n1) + Number(segundoNumero.n2);

                //Disminuir el score
                if (result < 0)
                    this.score = this.score + result;
                else
                    this.score = this.score - result;

                console.log('Suma:', result, 'score:', this.score);

                /*Cuando lleguen a 0 o menos, se seteará el puntaje a 100 nuevamente.*/
                if (this.score > 0){
                    const mensaje = {
                        usuario: this.nombreRecived,
                        operacion: 'Suma',
                        resultado: result,
                        puntuacion: this.score
                    };
                    return mensaje;
                }else{
                    this.score = 100;
                    console.log('El score se seteara nuevamente,', this.score);
                    const mensaje = {
                        operacion: 'Suma',
                        resultado: result,
                        mensaje: this.nombreRecived + ', haz terminado tus puntos, se te han restablecido de nuevo',
                        puntuacion: this.score,
                    };
                    return mensaje;
                }

            } else {
                throw new BadRequestException('Datos ingresados incorrectos');
            }
        } else {
            throw new BadRequestException('Debe registrar un usuario para usar la calculadora');
        }
    }

    /*RESTA (n1 - n2)
    PUT
    201
    BODY (n1)
    HEADERS, RUTA, QUERY, BODY (n2)*/

    //http://localhost:3001/deber01/resta
    @Put('resta')
    @HttpCode(201)
    resta(
        @Body() primerNumero,
        @Query() segundoNumero,
        @Headers() header
    ) {
        // Verificar si se ha registrado un usuario
        const cookies = header.cookie
        if (cookies){
            this.nombreRecived = cookies.substr(14); //header.cookie='nombreUsuario=username', substr extrae parte de un string
            console.log('usuario:', this.nombreRecived);
        }
        //---------------------------------------------------
        console.log('Resta:', primerNumero, segundoNumero);
        if (this.nombreRecived === '') {
            const mensaje = {mensaje: 'Debe registrar un usuario para usar la calculadora'};
            return mensaje
        } else {
        if (!isNaN(primerNumero.n1) && !isNaN(segundoNumero.n2)) {
            const result = Number(primerNumero.n1) - Number(segundoNumero.n2);

            if (result < 0)
                this.score = this.score + result;
            else
                this.score = this.score - result;

            console.log('Resta:', result, 'score:', this.score);

            const mensaje = {
                usuario: this.nombreRecived,
                operacion: 'Resta',
                resultado: result,
                puntuacion: this.score
            };
            return mensaje;
        } else {
            throw new BadRequestException('Datos ingresados incorrectos');
        }
        }
    }

    /*MULTIPLICACION (n1 * n2)
    DELETE
    200
    HEADERS (n1)
    HEADERS, RUTA, QUERY, BODY (n2)*/
    //http://localhost:3001/deber01/multiplicacion
    @Delete('multiplicacion')
    @HttpCode(200)
    async multiplicacion(
        @Headers() primerNumero, //n1
        @Body() segundoNumero
    ) {
        //Obtener nombre de usuario
        this.nombreRecived = primerNumero.cookie.substr(14); //header.cookie='nombreUsuario=username', substr extrae parte de un string

        console.log('Multiplicacion','{ n1:',primerNumero.n1,'}' , segundoNumero);
        if (this.nombreRecived === '') {
            const mensaje = {mensaje: 'Debe registrar un usuario para usar la calculadora'};
            console.log('Usuario no registrado',);
            return mensaje
        } else {
            //comprobar que son numeros
            if (!isNaN(primerNumero.n1) && !isNaN(segundoNumero.n2)) {
                const result = Number(primerNumero.n1) * Number(segundoNumero.n2);
                //disminuir score
                if (result < 0)
                    this.score = this.score + result;
                else
                    this.score = this.score - result;

                console.log('Multiplicacion:', result, 'score:', this.score);

                const mensaje = {
                    usuario: this.nombreRecived,
                    operacion: 'Multiplicacion',
                    resultado: result,
                    puntuacion: this.score
                };
                return mensaje;
            } else {
                throw new BadRequestException('Datos ingresados incorrectos');
            }
        }
    }

    /*DIVISION (n1 / n2)
    POST
    201
    RUTA (n1)
    HEADERS, RUTA, QUERY, BODY (n2)*/
    //http://localhost:3001/deber01/division
    @Post('division/:n1/')
    @HttpCode(200)
    async division(
        @Param() primerNumero,
        @Headers() segundoNumero
    ) {
        //Obtener nombre de usuario
        this.nombreRecived = segundoNumero.cookie.substr(14);

            console.log('Division', primerNumero, '{ n2:',segundoNumero.n2,'}');
        if (this.nombreRecived === '') {
            const mensaje = {mensaje: 'Debe registrar un usuario para usar la calculadora'};
            return mensaje
        } else {
            if (!isNaN(primerNumero.n1) && !isNaN(segundoNumero.n2)) {
                if (segundoNumero.n2 != 0)
                {
                    const result = Number(primerNumero.n1) / Number(segundoNumero.n2);

                    if (result < 0)
                        this.score = this.score + result;
                    else
                        this.score = this.score - result;

                    console.log('Division:', result, 'score:', this.score);

                    const mensaje = {
                        usuario: this.nombreRecived,
                        operacion: 'Division',
                        resultado: result,
                        puntuacion: this.score
                    };
                    return mensaje;
                }else{
                    throw new BadRequestException('El divisor no puede ser cero');
                }

            } else {
                throw new BadRequestException('Datos ingresados incorrectos');
            }


        }
    }

    /* METODO GUARDAR (nombre)
       GET
       (Guardar cookie inseguro y no firmada) nombre del usuario
        QUERY (nombre)*/
    //http://localhost:3001/deber01/guardarNombre
    @Get('guardarNombre')
    guardarCookieInseguraNoFirmada(
        @Query() nombreUsuario,
        //@Req() req, //request - PETICION
        @Res() res //response - RESPUESTA
    ) {
        res.cookie('nombreUsuario', nombreUsuario.nombre, {signed: false});
        this.nombreRecived = nombreUsuario.nombre;
        console.log(this.nombreRecived);
        if (this.nombreRecived === '' || !isString(this.nombreRecived)) {
            throw new BadRequestException('Datos ingresados incorrectos');
        } else {
            const mensaje = {
                mensaje: 'Usuario registrado con exito'
            };
            res.send(mensaje);
        }

    }

    //http://localhost:3001/deber01/iniciarCalculadora
    @Get('iniciarCalculadora')
    public guardarCookieSeguraFirmada(
        @Res() res,
        @Req() req,
        @Headers() header //obtener cabeceras
    ) {
        //verificar uduario registrado
        const cookies = header.cookie
        if (cookies){
            this.nombreRecived = cookies.substr(14); //header.cookie='nombreUsuario=username', substr extrae parte de un string
            console.log('usuario:', this.nombreRecived);
        }
        //---------------------------------------------------

        if (this.nombreRecived) {
            //res.cookie('score', 100, {secure: true, signed: true});
            const mensaje = {
                mensaje: 'Calculadora iniciada',
                usuario: this.nombreRecived,
                score: 100
            };
            res.send(mensaje);
        } else {
            const mensaje = {mensaje: 'Debe registrar un usuario para iniciar la calculadora'};
            res.send(mensaje);
        }
    }
}
