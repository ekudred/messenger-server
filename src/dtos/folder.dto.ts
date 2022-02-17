import { IsString, ValidateNested } from 'class-validator'

import { ChatDTO } from './chat.dto'

export class CreateDTO {
  @IsString()
  public userID!: string

  @IsString()
  public name!: string

  @ValidateNested()
  public chats!: ChatDTO[]
}

export class AddDTO {
  @IsString()
  public userID!: string

  @ValidateNested()
  public chatIDs!: string[]
}

export class FindAllDTO {
  @IsString()
  public userID!: string
}

export class DeleteDTO {
  @IsString()
  public folderID!: string
}

// export class FolderDTO {
//   public id: string
//   public userID: string
//   public name: string

//   constructor(object: { [key: string]: any }) {
//     this.id = object.id
//     this.userID = object.user_id
//     this.name = object.name
//   }

//   public toPlainObj(): Object {
//     return Object.assign({}, this)
//   }
// }
