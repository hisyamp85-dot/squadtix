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
        'id',
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
      const data = request.only(['name', 'username', 'email', 'password', 'role', 'status'])

      if (!data.name || !data.username || !data.email || !data.password || !data.role || !data.status) {
        return response.status(400).json({ error: 'All fields are required' })
      }

      // Cek unik username & email (optional tapi bagus)
      const existingUsername = await User.findBy('username', data.username)
      if (existingUsername) {
        return response.status(409).json({ error: 'Username already taken' })
      }

      const existingEmail = await User.findBy('email', data.email)
      if (existingEmail) {
        return response.status(409).json({ error: 'Email already registered' })
      }

      // Hash password
      const hashedPassword = await Hash.make(data.password)

      const user = await User.create({
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        status: data.status,
      })

      // Jangan kirim password balik
      return response.status(201).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    } catch (err) {
      console.error('Failed to create user:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
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

      const defaultRoles = ['Admin', 'User', 'Redemption', 'Scan Wristband']

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
      const id = params.id
      if (!id) {
        return response.status(400).json({ error: 'Invalid user ID' })
      }

      const user = await User.find(id)
      if (!user) {
        return response.status(404).json({ error: 'User not found' })
      }

      const data = request.only(['name', 'username', 'email', 'password', 'role', 'status'])

      // Kalau password diisi → hash baru, kalau kosong → abaikan (pakai yang lama)
      if (data.password && data.password.trim() !== '') {
        user.password = await Hash.make(data.password)
      }

      // Hapus password dari merge supaya tidak overwrite jadi string kosong
      const { password, ...rest } = data

      user.merge(rest)
      await user.save()

      return response.status(200).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    } catch (err) {
      console.error('Failed to update user:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
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
  public async login({ request, response }: HttpContextContract) {
    try {
      const { username, password } = request.only(['username', 'password'])

      if (!username || !password) {
        return response.status(400).json({ error: 'Username and password are required' })
      }

      const user = await User.findBy('username', username)

      if (!user) {
        return response.status(401).json({ error: 'Invalid credentials' })
      }

      // Optional: kalau mau blokir user non-aktif
      if (user.status && user.status.toLowerCase() !== 'active') {
        return response.status(403).json({ error: 'User is not active' })
      }

      let isValidPassword = false

      // Support 2 jenis password:
      // - hashed (scrypt / driver default Adonis)
      // - plain text lama
      if (user.password.startsWith('$scrypt$')) {
        isValidPassword = await Hash.verify(user.password, password)
      } else {
        isValidPassword = user.password === password
      }

      if (!isValidPassword) {
        return response.status(401).json({ error: 'Invalid credentials' })
      }

      return response.status(200).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    } catch (err) {
      console.error('Failed to login:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return response.status(500).json({ error: message })
    }
  }

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
