import { IsString } from 'class-validator'

export class GetChatsDTO {
  @IsString()
  public userID!: string
}

export class GetDialogsDTO {
  @IsString()
  public userID!: string
}

export class SearchChatsDTO {
  @IsString()
  public userID!: string

  @IsString()
  public value!: string
}
