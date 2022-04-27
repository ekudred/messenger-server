import { JsonController, Body, Post, UseBefore } from 'routing-controllers'
import 'reflect-metadata'

import UserService from '../../services/external/user.service'
import { EditDTO, FindDTO, DeleteDTO } from '../../dtos/router/profile.dto'
import { authRouterMiddleware } from '../../middlewares/router/auth.router-middleware'

import { authRolesArray } from '../../utils/constants'

@JsonController('/profile')
@UseBefore(authRouterMiddleware(authRolesArray))
class ProfileController {
  @Post('/edit')
  async edit(@Body({ options: { limit: '10mb' } }) body: EditDTO) {
    const data = await UserService.edit(body, { id: body.id })

    return data
  }

  @Post('/find')
  async find(@Body() body: FindDTO) {
    const data = await UserService.find(body)

    return data
  }

  @Post('/delete')
  async delete(@Body() body: DeleteDTO) {
    await UserService.delete(body)

    return null
  }
}

export default ProfileController
