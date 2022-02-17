import { IsString } from 'class-validator'

export class ChatDTO {
  @IsString()
  public id!: string

  @IsString()
  public userID!: string

  @IsString()
  public name!: string
}
