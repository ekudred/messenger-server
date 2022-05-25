export interface User {
  id: string
  username: string
  fullname: string
  birthdate: string
  avatar: string
  role: string
  isActivated: boolean
  createdAt: Date
  updatedAt: Date
}

// CreateUser

export interface CreateUserOptions {
  username: string
  email: string
  password: string
}

// EditUser

export interface UpdateUserOptions {
  id: string
  username: string
  fullname: string
  birthdate: string
  phone: string
  email: string
  avatar: string
  password: string
}

// DeleteUser

export interface DeleteUserOptions {
  id: string
}