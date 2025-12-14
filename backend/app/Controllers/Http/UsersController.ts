import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class UsersController {
  // ========================================================================
  //  LIST USERS
  // ========================================================================
  public async index({ response }: HttpContextContract) {
    try {
      // Jangan kirim password ke frontend
      const users = await User.query().select(
        'id_user',
        'name',
        'username',
        'email',
        'role',
        'status'
      )

      return response.status(200).json(users)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

  // ========================================================================
  //  CREATE USER
  // ========================================================================
 public async store({ request, response }: HttpContextContract) {
  try {
    const data = request.only([
      'name',
      'username',
      'email',
      'password',
      'role',
      'status',
    ])

    // ================= VALIDATION =================
    if (
      !data.name ||
      !data.username ||
      !data.email ||
      !data.password ||
      !data.role ||
      !data.status
    ) {
      return response.badRequest({ error: 'All fields are required' })
    }

    if (data.password.length < 6) {
      return response.badRequest({
        error: 'Password must be at least 6 characters',
      })
    }

    const existingUsername = await User.findBy('username', data.username)
    if (existingUsername) {
      return response.conflict({ error: 'Username already taken' })
    }

    const existingEmail = await User.findBy('email', data.email)
    if (existingEmail) {
      return response.conflict({ error: 'Email already registered' })
    }

    // ================= CREATE USER =================
    const user = await User.create({
      name: data.name,
      username: data.username,
      email: data.email,
      password: await Hash.make(data.password), // 🔐 ARGON2
      role: data.role,
      status: data.status.toLowerCase() === 'active' ? 'Active' : 'Inactive',
    })

    // ================= RESPONSE =================
    return response.created({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    })
  } catch (err) {
    console.error('Failed to create user:', err)
    return response.internalServerError({
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}


  // ========================================================================
  //  DELETE USER
  // ========================================================================
  public async delete({ params, response }: HttpContextContract) {
    try {
      const id = params.id

      if (!id) {
        return response.status(400).json({ error: 'Invalid user ID' })
      }

      const user = await User.find(id)
      if (!user) {
        return response.status(404).json({ error: 'User not found' })
      }

      await user.delete()
      return response.status(200).json({ message: 'User deleted successfully' })
    } catch (err) {
      console.error('Failed to delete user:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

  // ========================================================================
  //  ROLES (UNTUK DROPDOWN ROLE DI FRONTEND)
  // ========================================================================
  public async roles({ response }: HttpContextContract) {
    try {
      const dbRoles = await User.query()
        .select('role')
        .distinct()
        .whereNotNull('role')
        .orderBy('role')

      const dbRoleNames = dbRoles
        .map((r) => r.role)
        .filter((r): r is string => !!r)
        .map((role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())

      const defaultRoles = ['Admin', 'User', 'Scanner']

      const allRoles = [...new Set([...defaultRoles, ...dbRoleNames])]

      return response.json(allRoles)
    } catch (err) {
      console.error('Failed to fetch roles:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

  // ========================================================================
  //  CHECK USERNAME
  // ========================================================================
  public async checkUsername({ request, response }: HttpContextContract) {
    try {
      const username = request.input('username')
      if (!username) {
        return response.status(400).json({ error: 'username is required' })
      }
      const user = await User.findBy('username', username)
      return response.json({ exists: !!user })
    } catch (err) {
      console.error('Failed to check username:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

  // ========================================================================
  //  CHECK EMAIL
  // ========================================================================
  public async checkEmail({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      if (!email) {
        return response.status(400).json({ error: 'email is required' })
      }
      const user = await User.findBy('email', email)
      return response.json({ exists: !!user })
    } catch (err) {
      console.error('Failed to check email:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

  // ========================================================================
  //  UPDATE USER
  // ========================================================================
public async update({ params, request, response }: HttpContextContract) {
  try {
    const user = await User.findBy('id_user', params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const { password, ...rest } = request.only([
      'name',
      'username',
      'email',
      'password',
      'role',
      'status',
    ])

    user.merge(rest)

    if (password && password.trim().length >= 6) {
      user.password = await Hash.make(password)
    }

    await user.save()

    return response.ok({
      id: user.id,
      username: user.username,
      status: user.status,
    })
  } catch (error) {
    console.error(error)
    return response.internalServerError({
      message: 'Failed to update user',
    })
  }
}




  // ========================================================================
  //  SHOW USER (DETAIL)
  // ========================================================================
  public async show({ params, response }: HttpContextContract) {
    try {
      const id = params.id
      if (!id) {
        return response.status(400).json({ error: 'Invalid user ID' })
      }

      const user = await User.find(id)
      if (!user) {
        return response.status(404).json({ error: 'User not found' })
      }

      // Jangan kirim hash password ke frontend
      return response.status(200).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    } catch (err) {
      console.error('Failed to fetch user:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

  // ========================================================================
  //  LOGIN
  // ========================================================================





  // ========================================================================
  //  COUNT USERS (UNTUK DASHBOARD)
  // ========================================================================
  public async count({ response }: HttpContextContract) {
    try {
      const count = await User.query().count('* as total')
      return response
        .status(200)
        .json({ count: Number(count[0].$extras.total ?? 0) })
    } catch (err) {
      console.error('Failed to count users:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

 

}
