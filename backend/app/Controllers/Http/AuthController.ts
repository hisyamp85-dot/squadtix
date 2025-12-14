import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class AuthController {
  // ========================================================================
  //  LOGIN
  // ========================================================================
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      const { username, password } = request.only(['username', 'password'])

      if (!username || !password) {
        return response.badRequest({
          message: 'Username dan password wajib diisi',
        })
      }

      const user = await User.findBy('username', username)

      if (!user) {
        return response.unauthorized({
          message: 'Username atau password salah',
        })
      }

      if (user.status !== 'Active') {
        return response.forbidden({
          message: 'User tidak aktif',
        })
      }

      const isValid = await Hash.verify(user.password, password)

      if (!isValid) {
        return response.unauthorized({
          message: 'Username atau password salah',
        })
      }

      // 🔐 BUAT TOKEN (WAJIB ADA EXPIRE)
      const token = await auth.use('api').generate(user, {
        expiresIn: '12h',
      })

      return response.ok({
        type: 'bearer',
        token: token.token,
        expires_at: token.expiresAt,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Login gagal',
      })
    }
  }

  // ========================================================================
  //  LOGOUT
  // ========================================================================
  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return response.ok({ message: 'Logout berhasil' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Logout gagal',
      })
    }
  }

  // ========================================================================
  //  ME (optional tapi sangat berguna)
  // ========================================================================
  public async me({ auth }: HttpContextContract) {
  const user = auth.user
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
  }
}

}
