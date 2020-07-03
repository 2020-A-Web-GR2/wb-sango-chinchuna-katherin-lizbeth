import {Module} from "@nestjs/common";
import {HttpJuegoController} from "./http-juego.controller";

@Module(
    {
        imports: [],
        controllers: [
            HttpJuegoController
        ],
        providers: [],
    }
)
export class HttpJuegoModule{

}
