import {IsAlpha, IsDateString, IsDecimal, IsEmpty, IsOptional, MaxLength} from "class-validator";

export class UsuarioUpdateDto{

    @IsAlpha() //valor puede ser A-Za-z
    @IsOptional()
    @MaxLength(60)
    nombre?: string;

    @IsAlpha()
    @IsOptional()
    @MaxLength(60)
    apellido?: string;

    @IsOptional()
    @IsDecimal({'decimal_digits': '0,4'}) //decimal_digits: scala
    sueldo?:number;

    @IsOptional()
    @IsDateString()
    fechaNacimiento?:string;

    @IsOptional()
    @IsDateString()
    fechaHoraNacimiento?:string;
}