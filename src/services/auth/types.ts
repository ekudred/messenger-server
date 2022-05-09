// SignUp

import { CreateUserOptions } from '../user/types'

export interface SignUpOptions extends CreateUserOptions {
}

// SignIn

export interface SignInOptions {
  username: string
  password: string
  clientID: string
}

// SignOut

export interface SignOutOptions {
  refreshToken: string
}

// Refresh

export interface RefreshOptions {
  refreshToken: string
  clientID: string
}

// Active

export interface ActiveOptions {
  activationLink: string
}

// ConfirmUser

export interface ConfirmUserOptions {
  id: string
  password: string
}