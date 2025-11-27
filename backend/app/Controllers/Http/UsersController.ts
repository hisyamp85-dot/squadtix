import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all()
      return response.status(200).json(users)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['name','username', 'email','password' , 'role', 'status'])
      // Validate required fields
      if (!data.name || !data.username || !data.email || !data.password || !data.role || !data.status) {
        return response.status(400).json({ error: 'All fields are required' })
      }
      // Store plain text password
      console.log('Creating user with data:', data)
      const user = await User.create(data)
      console.log('User created successfully:', user)
      return response.status(201).json(user)
    } catch (err) {
      console.error('Failed to create user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    try {
      const id = params.id
      if (!id) {
        return response.status(400).json({ error: 'Invalid user ID' })
      }
      const user = await User.findOrFail(id)
      await user.delete()
      return response.status(200).json({ message: 'User deleted successfully' })
    } catch (err) {
      console.error('Failed to delete user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async roles({ response }: HttpContextContract) {
    try {
      const dbRoles = await User.query().select('role').distinct().whereNotNull('role').orderBy('role')
      const dbRoleNames = dbRoles.map((r: any) => r.role.charAt(0).toUpperCase() + r.role.slice(1).toLowerCase())
      const defaultRoles = ['Admin', 'User', 'Redemption', 'Scan Wristband']
      const allRoles = [...new Set([...defaultRoles, ...dbRoleNames])]
      return response.json(allRoles)
    } catch (err) {
      console.error('Failed to fetch roles:', err)
      return response.status(500).json({ error: err.message })
    }
  }



  public async checkUsername({ request, response }: HttpContextContract) {
    try {
      const username = request.input('username')
      const user = await User.findBy('username', username)
      return response.json({ exists: !!user })
    } catch (err) {
      console.error('Failed to check username:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async checkEmail({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const user = await User.findBy('email', email)
      return response.json({ exists: !!user })
    } catch (err) {
      console.error('Failed to check email:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const id = params.id
      if (!id) {
        return response.status(400).json({ error: 'Invalid user ID' })
      }
      const user = await User.findOrFail(id)
      const data = request.only(['name', 'username', 'email', 'password', 'role', 'status'])
      // Store plain text password if provided
      user.merge(data)
      await user.save()
      return response.status(200).json(user)
    } catch (err) {
      console.error('Failed to update user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

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
      return response.status(200).json({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        status: user.status,
      })
    } catch (err) {
      console.error('Failed to fetch user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

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
      let isValidPassword = false
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
      return response.status(500).json({ error: err.message })
    }
  }

  public async count({ response }: HttpContextContract) {
    try {
      const count = await (User as any).query().count('* as total')
      return response.status(200).json({ count: count[0].$extras.total })
    } catch (err) {
      console.error('Failed to count users:', err)
      return response.status(500).json({ error: err.message })
    }
  }
}
