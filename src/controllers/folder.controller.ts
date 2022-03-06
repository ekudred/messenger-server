import { JsonController, Body, Post, UseBefore } from 'routing-controllers'
import 'reflect-metadata'

import FolderService from '../services/external/folder.service'
import { AddDTO, CreateDTO, FindAllDTO, DeleteDTO } from '../dtos/folder.dto'
import authMiddleware from '../middlewares/auth.middleware'

import { AuthRoles } from '../utils/constants'

@JsonController('/folder')
class ProfileController {
  @Post('/create')
  // @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async find(@Body() body: CreateDTO) {
    const folderData = await FolderService.create(body)

    return folderData
  }

  @Post('/add')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async edit(@Body() body: AddDTO) {
    const folderData = await FolderService.add(body)

    return folderData
  }

  @Post('/findAll')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async findAll(@Body() body: FindAllDTO) {
    const folderData = await FolderService.findAll(body)

    return folderData
  }

  @Post('/delete')
  @UseBefore(authMiddleware([AuthRoles.ADMIN, AuthRoles.USER]))
  async delete(@Body() body: DeleteDTO) {
    await FolderService.delete(body)

    return null
  }
}

export default ProfileController
