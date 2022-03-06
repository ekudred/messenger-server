import { Response } from 'express'
import { JsonController, Param, CookieParam, Body, Post, Get, Res, UseBefore, Redirect, QueryParams } from 'routing-controllers'
import 'reflect-metadata'

import AuthService from '../services/external/auth.service'
import { SignUpDTO, SignInDTO, RefreshDTO } from '../dtos/auth.dto'
import authMiddleware from '../middlewares/auth.middleware'

import { cookieOptionsToken, AuthRoles } from '../utils/constants'

@JsonController('/auth')
class AuthController {
  @Post('/sign-up')
  async signUp(@Body() body: SignUpDTO) {
    const userData = await AuthService.signUp(body)

    return userData
  }

  @Post('/sign-in')
  async signIn(@Body() body: SignInDTO, @Res() res: Response) {
    const userData = await AuthService.signIn(body)
    res.cookie('refreshToken', userData.refreshToken, cookieOptionsToken)

    return userData
  }

  @Post('/sign-out')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async signOut(@CookieParam('refreshToken') refreshToken: string, @Res() res: Response) {
    await AuthService.signOut({ refreshToken })
    res.clearCookie('refreshToken')

    return null
  }

  @Get('/refresh')
  async refresh(@CookieParam('refreshToken') refreshToken: string, @QueryParams() params: RefreshDTO, @Res() res: Response) {
    const userData = await AuthService.refresh({ refreshToken, ...params })
    res.cookie('refreshToken', userData.refreshToken, cookieOptionsToken)

    return userData
  }

  @Get('/activate/:link')
  @Redirect(process.env.CLIENT_URL + '/auth/sign-in')
  async activate(@Param('link') link: string) {
    await AuthService.activate({ activationLink: link })

    return null
  }
}

export default AuthController
