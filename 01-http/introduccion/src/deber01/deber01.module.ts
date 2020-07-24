import {Module} from "@nestjs/common";
import {Deber01Controller} from "./deber01.controller";

@Module(
    {
        imports: [],
        controllers: [
            Deber01Controller
        ],
        providers: [],
    }
)
export class Deber01Module {

}