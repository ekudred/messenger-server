import { JsonController, Body, Post, UseBefore } from 'routing-controllers'
import 'reflect-metadata'

import UserService from '../services/external/user.service'
import { EditDTO, FindDTO, DeleteDTO, ConfirmDTO } from '../dtos/profile.dto'
import authMiddleware from '../middlewares/auth.middleware'

import { AuthRoles } from '../utils/constants'

@JsonController('/profile')
class ProfileController {
  @Post('/find')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async find(@Body() body: FindDTO) {
    const userData = await UserService.find(body)

    return userData
  }

  @Post('/edit')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async edit(@Body({ options: { limit: '10mb' } }) body: EditDTO) {
    const userData = await UserService.edit(body, { id: body.id })

    return userData
  }

  @Post('/delete')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async delete(@Body() body: DeleteDTO) {
    await UserService.delete(body)

    return null
  }

  @Post('/confirm')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async confirm(@Body() body: ConfirmDTO) {
    const isConfirm = await UserService.confirm(body)

    return isConfirm
  }
}

export default ProfileController
