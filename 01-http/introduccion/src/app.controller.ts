import {Body, Controller, Get, Post, Req, Res, Session} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //metodos para renderizar el login
  @Get('login')
  login(
      @Res() response
  ){
    return response.render('login/login')
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
    if (usuario == 'katherin' && password == '1234'){
      session.usuario = usuario;
      session.roles = ['Administrador'];
      return response.redirect('protegido');
    }else{
      if (usuario == 'lizbeth' && password == '4321'){
        session.usuario = usuario;
        session.roles = ['Supervisor'];
        return response.redirect('protegido');
      }else {
        return response.redirect('login');
      }
    }
  }

  @Get('/protegido')
  protegido(
      @Res() response,
      @Session() session
  ){
    const estaLogueado = session.usuario;
    if (estaLogueado){
      return response.render(
          '/protegido',
          {
            usuario: session.usuario,
            roles: session.roles
          }
      )
    }else {
      return response.redirect('/login')
    }
  }

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
