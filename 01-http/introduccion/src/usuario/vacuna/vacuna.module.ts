import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {VacunaEntity} from "./vacuna.entity";

@Module({
    controllers: [],
    imports: [
        TypeOrmModule
            .forFeature(
                [
                    VacunaEntity
                ],
                'default' //Nombre cadena de conexion
            )
    ],
    providers: []
})
export class VacunaModule{

}