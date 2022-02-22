import { JsonController as Controller, Body, Post, UseBefore } from 'routing-controllers'
import 'reflect-metadata'

import UserService from '../services/user.service'
import { EditDTO, FindDTO, DeleteDTO, ConfirmDTO } from '../dtos/profile.dto'
import authMiddleware from '../middlewares/auth.middleware'

import { Roles } from '../utils/constants'

@Controller('/profile')
class ProfileController {
  @Post('/find')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async find(@Body() body: FindDTO) {
    const userData = await UserService.find(body)

    return userData
  }

  @Post('/edit')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async edit(@Body({ options: { limit: '10mb' } }) body: EditDTO) {
    const userData = await UserService.edit(body, { id: body.id })

    return userData
  }

  @Post('/delete')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async delete(@Body() body: DeleteDTO) {
    await UserService.delete(body)

    return null
  }

  @Post('/confirm')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async confirm(@Body() body: ConfirmDTO) {
    const isConfirm = await UserService.confirm(body)

    return isConfirm
  }
}

export default ProfileController
