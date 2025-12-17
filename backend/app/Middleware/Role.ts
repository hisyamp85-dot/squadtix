import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoleMiddleware {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[]
  ) {
    // 🔐 Pastikan user sudah login
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Unauthorized',
      })
    }

    // 🧹 Normalisasi role (aman dari Admin / admin / ADMIN)
    const userRole = String(user.role).toLowerCase()
    const roles = allowedRoles.map((r) => r.toLowerCase())

    // ⛔ Role tidak diizinkan
    if (!roles.includes(userRole)) {
      return response.forbidden({
        message: 'Forbidden: insufficient role',
        role: user.role,
        allowedRoles,
      })
    }

    // ✅ Lanjut request
    await next()
  }
}
