import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginRepository } from 'src/repositories/login-repository';
import { LoginBody } from './dtos/login-body';
import md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
import { WithLoginBody } from './dtos/withLogin-body';
import { MessageService } from 'src/service/message.service';
import { ENVService } from 'src/service/env.service';
import { Response } from 'express';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import LoginBodySwagger from './dtos/swagger/login-body';
import { CompanyRepository } from 'src/repositories/company-repository';
import ManagerCompanyRepository from 'src/repositories/manager-company-repository';
import { z } from 'zod';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { ContextService } from 'src/service/request-context.service';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(
    private loginRepository: LoginRepository,
    private jwtService: JwtService,
    private envService: ENVService,
    private companyRepository: CompanyRepository,
    private managerCompanyRepository: ManagerCompanyRepository,
    private contextService: ContextService,
  ) {}

  @ApiBody({
    type: LoginBodySwagger,
  })
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/')
  async login(@Req() req, @Res() res, @Body() body: LoginBody) {
    const { login, pass, clientBound } = body;

    const user = await this.loginRepository.findLogin(login);

    if (!user) {
      throw new ForbiddenException(MessageService.Login_or_pass_error);
    }

    const passwordTypedMD5 = md5(pass);

    if (passwordTypedMD5 !== user.pswd) {
      throw new ForbiddenException(MessageService.Pass_error);
    }

    if (clientBound) {
      const company = await this.companyRepository.findById(clientBound);

      if (!company) {
        throw new ForbiddenException(MessageService.Company_not_found);
      }
    }

    const context = this.contextService.getContext();

    const payload = {
      sub: user.login,
      clientId: clientBound || user.id_cliente,
      tenantId: context.tenantId,
    };

    console.log('login => ', payload);

    const durationToken = 3 * 60 * 3000; // 3 min (teste) — depois: 3 * 60 * 60 * 1000

    const token = await this.jwtService.signAsync(payload, {
      secret: this.envService.KEY,
      expiresIn: durationToken / 1000,
    });

    //cookie
    res.cookie('jwt', token, {
      httpOnly: true, // Impede que o JavaScript do cliente acesse o cookie
      secure: process.env.NODE_ENV === 'production', // Apenas em HTTPS
      maxAge: durationToken,
      //7 * 24 * 60 * 60 * 1000, // Tempo de vida do cookie (7 dias)
    });

    res.send({
      token,
    });
  }

  @ApiExcludeEndpoint()
  @Post('/with-login')
  async withLogin(
    @Req() req,
    @Res() res: Response,
    @Body() body: WithLoginBody,
  ) {
    const { login, clientBound } = body;

    const user = await this.loginRepository.findLogin(login);

    if (!user) {
      throw new ForbiddenException(MessageService.Login_or_pass_error);
    }

    if (clientBound) {
      const company = await this.companyRepository.findById(
        Number(clientBound),
      );

      if (!company) {
        throw new ForbiddenException(MessageService.Company_not_found);
      }
    }

    const context = this.contextService.getContext();

    const payload = {
      sub: user.login,
      clientId: clientBound || user.id_cliente,
      tenantId: context.tenantId,
    };

    console.log('with-login => ', payload);

    const durationToken = 1 * 60 * 3000; // 1 min (teste) — depois: 3 * 60 * 60 * 1000

    const token = await this.jwtService.signAsync(payload, {
      secret: this.envService.KEY,
      expiresIn: durationToken / 1000,
    });

    // return {
    //   token: await this.jwtService.signAsync(payload, {
    //     secret: this.envService.KEY,
    //   }),
    // };

    //cookie
    res.cookie('jwt', token, {
      httpOnly: true, // Impede que o JavaScript do cliente acesse o cookie
      secure:
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'teste', // Apenas em HTTPS
      maxAge: durationToken,
      //7 * 24 * 60 * 60 * 1000, // Tempo de vida do cookie (7 dias)
    });

    res.send({ token });
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Get('/manager-company')
  async managerCompany(@Req() req) {
    const user: IUserInfo = req.user;

    const userInfo = await this.loginRepository.findLogin(user.login);

    if (!userInfo) {
      throw new ForbiddenException(MessageService.Login_not_found);
    }

    const managerCompany = await this.managerCompanyRepository.listByLogin(
      user.login,
    );

    if (!managerCompany.length) {
      await this.managerCompanyRepository.create({
        id_cliente: user.clientId,
        id_empresa: user.clientId,
        log_user: user.login,
        user: user.login,
      });

      return {
        user: user.name,
        companies: [
          {
            id: userInfo.id_cliente,
            name: userInfo.company.nome_fantasia,
            cnpj: userInfo.company.cnpj,
            img: `${this.envService.URL_IMAGE}/img_os/img_${userInfo.id_cliente}.jpg`,
          },
        ],
      };
    } else {
      return {
        user: user.name,
        companies: managerCompany.map((company) => ({
          id: company.companyBound.ID,
          name: company.companyBound.nome_fantasia,
          cnpj: company.companyBound.cnpj,
          img: `${this.envService.URL_IMAGE}/img_os/img_${company.companyBound.ID}.jpg`,
        })),
      };
    }
  }

  @ApiExcludeEndpoint()
  @Get('/bound-bank')
  async boundBank(@Req() req) {
    const querySchema = z.object({
      login: z.string(),
    });

    const query = querySchema.parse(req.query);

    const user = await this.loginRepository.findLogin(query.login);

    if (!user) {
      throw new ForbiddenException(MessageService.Login_not_found);
    }

    const response = user.boundBank.map((bank) => ({
      id: bank.id,
      name: bank.bank.nome,
    }));

    return {
      bank: response,
    };
  }
}
