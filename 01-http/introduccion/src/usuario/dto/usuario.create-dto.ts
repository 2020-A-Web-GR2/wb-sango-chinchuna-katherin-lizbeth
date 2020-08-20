import {
    IsAlpha,
    IsDateString,
    IsDecimal,
    IsEmpty,
    IsNotEmpty,
    IsOptional,
    Length,
    MaxLength
} from "class-validator";

export class UsuarioCreateDto{

    @IsAlpha() //valor puede ser A-Za-z
    @IsOptional()
    @MaxLength(60)
    nombre?: string;

    @IsAlpha()
    @IsOptional()
    @MaxLength(60)
    apellido?: string;

    @IsNotEmpty()
    @Length(10,18)  // entre 10 y 18 caracteres    cedula: string;
    cedula: string;

    //falta validar la presicion
    @IsOptional()
    @IsDecimal({'decimal_digits': '0,4'}) //string es decimal - decimal_digits: scala
    sueldo?:number;

    @IsOptional()
    @IsDateString() //ejemplo, "2017-06-07T14: 34: 08.700Z", "2017-06-07T14: 34: 08.700" o" 2017-06-07T14: 34: 08 + 04: 00 "
    fechaNacimiento?:string;

    @IsOptional()
    @IsDateString()  //ejemplo, "2017-06-07T14: 34: 08.700Z", "2017-06-07T14: 34: 08.700" o" 2017-06-07T14: 34: 08 + 04: 00 "
    fechaHoraNacimiento?:string;
}