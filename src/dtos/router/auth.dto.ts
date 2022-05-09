import { IsEmail, IsString, Matches } from 'class-validator'

import { SignUpOptions, ConfirmUserOptions } from '../../services/auth/types'
import { RegExpPassword, RegExpUserName } from '../../utils/constants'

export class SignUpDTO implements SignUpOptions {
  @IsString()
  @Matches(RegExpUserName, { message: 'Username is invalid' })
  public username!: string

  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  public email!: string

  @IsString()
  @Matches(RegExpPassword, { message: 'Password is invalid' })
  public password!: string
}

export class SignInDTO {
  @IsString()
  @Matches(RegExpUserName, { message: 'Username is invalid' })
  public username!: string

  @IsString()
  @Matches(RegExpPassword, { message: 'Password is invalid' })
  public password!: string
}

export class ConfirmUserDTO implements ConfirmUserOptions {
  @IsString()
  public id!: string

  @IsString()
  @Matches(RegExpPassword, { message: 'Password is invalid' })
  public password!: string
}
