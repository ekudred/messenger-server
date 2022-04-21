import { IsString } from 'class-validator'

export class GetChatDTO {
  @IsString()
  public type!: string

  @IsString()
  public id!: string

  @IsString()
  public userID!: string
}
