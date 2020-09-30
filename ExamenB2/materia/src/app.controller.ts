import {Body, Controller, Get, Post, Req, Res, Session} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('login')
  login(
      @Res() res
  ){
    res.render('login/login')
  }

  @Post('login')
  loginPost(
      @Body() parametrosConsulta,
      @Res() response,
      @Session() session   //se lo puede usar en cualquier controlador
  ){
    //aqui se debe consultar si existe el usuario, etc  -- todas las validaciones de datos
    const usuario = parametrosConsulta.usuario;
    const password = parametrosConsulta.password;
    if (usuario == 'Adrian' && password == '1234'){
      session.usuario = usuario;
      session.roles = ['Administrador'];
      return response.redirect('/materia/vista/inicio');
    }
  }

  // @Get('/protegido')
  // protegido(
  //     @Res() response,
  //     @Session() session
  // ){
  //   const estaLogueado = session.usuario;
  //   if (estaLogueado){
  //     return response.render(
  //         'login/protegido',
  //         {
  //           usuario: session.usuario,
  //           roles: session.roles
  //         }
  //     )
  //   }else {
  //     return response.redirect('/login')
  //   }
  // }

  @Get('logout')
  logout(
      @Res() response,
      @Req() request,
      @Session() session
  ){
    session.username = undefined;
    session.roles = undefined;
    request.session.destroy();
    return response.redirect('login');
  }
}
