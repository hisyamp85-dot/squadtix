import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import crypto from 'crypto'

import User from 'App/Models/User'
import RefreshToken from 'App/Models/RefreshToken'

export default class AuthController {
  // =========================================================================
  // LOGIN
  // =========================================================================
  public async login({ request, auth, response }: HttpContextContract) {
    const { username, password } = request.only(['username', 'password'])

    if (!username || !password) {
      return response.badRequest({
        message: 'Username dan password wajib diisi',
      })
    }

    const user = await User.findBy('username', username)

    if (!user || user.status !== 'Active') {
      return response.unauthorized({
        message: 'Username atau password salah',
      })
    }

    const isValid = await Hash.verify(user.password, password)
    if (!isValid) {
      return response.unauthorized({
        message: 'Username atau password salah',
      })
    }

    // 🔐 ACCESS TOKEN (SHORT LIVED)
    const accessToken = await auth.use('api').generate(user, {
      expiresIn: '15m',
    })

    // 🔁 REFRESH TOKEN (LONG LIVED)
    const refreshTokenValue = crypto.randomBytes(40).toString('hex')

    await RefreshToken.create({
      userId: user.id, // SESUAI migration kamu
      token: refreshTokenValue,
      expiresAt: DateTime.now().plus({ days: 30 }),
      isRevoked: false,
    })

    return response.ok({
      type: 'bearer',
      token: accessToken.token,
      expires_at: accessToken.expiresAt,
      refresh_token: refreshTokenValue,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  }

  // =========================================================================
  // REFRESH TOKEN
  // =========================================================================
  public async refresh({ request, auth, response }: HttpContextContract) {
    const refreshTokenValue = request.input('refresh_token')

    if (!refreshTokenValue) {
      return response.badRequest({ message: 'Refresh token required' })
    }

    const storedToken = await RefreshToken.query()
      .where('token', refreshTokenValue)
      .where('is_revoked', false)
      .where('expires_at', '>', DateTime.now().toSQL())
      .preload('user')
      .first()

    if (!storedToken || !storedToken.user) {
      return response.unauthorized({ message: 'Invalid refresh token' })
    }

    // revoke token lama
    storedToken.isRevoked = true
    await storedToken.save()

    // buat token baru
    const newRefreshToken = crypto.randomBytes(40).toString('hex')

    await RefreshToken.create({
      userId: storedToken.user.id,
      token: newRefreshToken,
      expiresAt: DateTime.now().plus({ days: 30 }),
      isRevoked: false,
    })

    const newAccessToken = await auth.use('api').generate(storedToken.user, {
      expiresIn: '15m',
    })

    return response.ok({
      token: newAccessToken.token,
      expires_at: newAccessToken.expiresAt,
      refresh_token: newRefreshToken,
    })
  }

  // =========================================================================
  // LOGOUT
  // =========================================================================
    public async logout({ auth, request, response }: HttpContextContract) {
    const refreshToken = request.input('refresh_token')

    if (refreshToken) {
      await RefreshToken
        .query()
        .where('token', refreshToken)
        .update({ is_revoked: true })
    }

    await auth.use('api').logout()

    return response.ok({
      message: 'Logged out successfully',
    })
  }


  // =========================================================================
  // ME
  // =========================================================================
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
