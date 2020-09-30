import {IsAlpha, IsNotEmpty, IsOptional, MaxLength} from "class-validator";

export class MateriaCreateDto{

    //@IsAlpha()
    @MaxLength(60)
    nombre: string;

    @IsNotEmpty()
    @MaxLength(20)
    codigo: string;

    @MaxLength(10)
    paralelo: string;

    @MaxLength(10)
    @IsOptional()
    horario?: string;

    @MaxLength(10)
    periodo: string;
}