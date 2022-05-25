import { Request, Response } from 'express'
import { JsonController, Param, CookieParam, Body, Post, Get, Res, Req, UseBefore, Redirect } from 'routing-controllers'
import 'reflect-metadata'

import AuthService from '../../services/auth'
import { SignUpDTO, SignInDTO, ConfirmUserDTO } from '../../dtos/router/auth.dto'
import { authRouterMiddleware } from '../../middlewares/router/auth.router-middleware'
import { cookieOptionsToken, authRolesArray } from '../../utils/constants'

@JsonController('/auth')
class AuthController {
  @Post('/sign-up')
  async signUp(@Body() body: SignUpDTO) {
    const data = await AuthService.signUp(body)

    return data
  }

  @Post('/sign-in')
  async signIn(@Body() body: SignInDTO, @Req() req: Request, @Res() res: Response) {
    const clientID = req.headers['client-id'] as string

    const data = await AuthService.signIn({ ...body, clientID })
    res.cookie('refreshToken', data.refreshToken, cookieOptionsToken)

    return data
  }

  @Post('/sign-out')
  @UseBefore(authRouterMiddleware(authRolesArray))
  async signOut(@CookieParam('refreshToken') refreshToken: string, @Res() res: Response) {
    await AuthService.signOut({ refreshToken })
    res.clearCookie('refreshToken')

    return null
  }

  @Post('/refresh')
  async refresh(@CookieParam('refreshToken') refreshToken: string, @Req() req: Request, @Res() res: Response) {
    const clientID = req.headers['client-id'] as string

    const data = await AuthService.refresh({ refreshToken, clientID })
    res.cookie('refreshToken', data.refreshToken, cookieOptionsToken)

    return data
  }

  @Get('/activate/:link')
  @Redirect(process.env.CLIENT_URL + '/auth/sign-in')
  async activate(@Param('link') activationLink: string) {
    await AuthService.activate({ activationLink })

    return null
  }

  @Post('/confirm')
  @UseBefore(authRouterMiddleware(authRolesArray))
  async confirmUser(@Body() body: ConfirmUserDTO) {
    const data = await AuthService.confirmUser(body)

    return data
  }
}

export default AuthController
