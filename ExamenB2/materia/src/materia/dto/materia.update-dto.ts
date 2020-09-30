import {IsAlpha, IsNotEmpty, IsOptional, MaxLength} from "class-validator";

export class MateriaUpdateDto{
    @IsAlpha()
    @MaxLength(60)
    nombre: string;

    @MaxLength(10)
    paralelo: string;

    @MaxLength(10)
    @IsOptional()
    horario?: string;

    @MaxLength(10)
    periodo: string;
}