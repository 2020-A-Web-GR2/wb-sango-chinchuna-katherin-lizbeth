//https://github.com/typestack/class-validator#samples

import {
    IsAlpha, IsBoolean,
    IsInt,
    IsNotEmpty, IsNumber,
    IsOptional,
    IsPositive,
    MaxLength,
    MinLength
} from "class-validator";


export class MascotaCreateDto {

    @IsNotEmpty()
    @IsAlpha()
    @MinLength(3)
    @MaxLength(60)
    nombre:string; //de 3 a 60 caracteres

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    edad:number;

    @IsNotEmpty()
    @IsBoolean()
    casada:boolean;

    @IsOptional()
    @IsBoolean()
    ligada?:boolean; //Para poner que es opcional se usa ? a veces existe a veces no

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    peso:number;

}