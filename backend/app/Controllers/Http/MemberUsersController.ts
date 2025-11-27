import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import MemberUser from 'App/Models/MemberUser'
import Hash from '@ioc:Adonis/Core/Hash'

export default class MemberUsersController {
  // Helper function to parse a CSV row, handling quoted fields
  private parseCsvRow(row: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }
  public async index({ response }: HttpContextContract) {
    try {
      const memberUsers = await MemberUser.all()
      const serializedUsers = memberUsers.map(user => ({
        id: user.id,
        username: user.username,
        password: user.password,
        status: user.status,
        section: user.section,
        idUser: user.idUser,
        created_at: user.createdAt.toISO(),
        updated_at: user.updatedAt.toISO(),
      }))
      return response.status(200).json(serializedUsers)
    } catch (err) {
      console.error('Failed to fetch member users:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['username', 'password', 'status', 'section', 'idUser'])
      const memberUser = await MemberUser.create(data)
      return response.status(201).json(memberUser)
    } catch (err) {
      console.error('Failed to create member user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    try {
      const id = params.id
      if (!id) {
        return response.status(400).json({ error: 'Invalid member user ID' })
      }
      const memberUser = await MemberUser.findOrFail(id)
      await memberUser.delete()
      return response.status(200).json({ message: 'Member user deleted successfully' })
    } catch (err) {
      console.error('Failed to delete member user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async bulkDelete({ request, response }: HttpContextContract) {
    try {
      const { ids } = request.only(['ids'])
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return response.status(400).json({ error: 'Invalid or empty ids array' })
      }

      const deletedCount = await MemberUser.query().whereIn('id', ids).delete()
      return response.status(200).json({ message: `${deletedCount} member users deleted successfully` })
    } catch (err) {
      console.error('Failed to bulk delete member users:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const id = params.id
      if (!id) {
        return response.status(400).json({ error: 'Invalid member user ID' })
      }
      const memberUser = await MemberUser.findOrFail(id)
      const data = request.only(['username', 'password', 'status', 'section', 'idUser'])
      // Allow idUser to be updated even if null
      memberUser.merge(data)
      await memberUser.save()
      return response.status(200).json(memberUser)
    } catch (err) {
      console.error('Failed to update member user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const id = params.id
      if (!id) {
        return response.status(400).json({ error: 'Invalid member user ID' })
      }
      const memberUser = await MemberUser.findOrFail(id)
      return response.status(200).json({
        id: memberUser.id,
        username: memberUser.username,
        password: memberUser.password,
        status: memberUser.status,
        section: memberUser.section,
        idUser: memberUser.idUser,
      })
    } catch (err) {
      console.error('Failed to fetch member user:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async count({ response }: HttpContextContract) {
    try {
      const count = await (MemberUser as any).query().count('* as total')
      return response.status(200).json({ count: count[0].$extras.total })
    } catch (err) {
      console.error('Failed to count member users:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async checkExists({ params, response }: HttpContextContract) {
    try {
      const { userId } = params
      if (!userId) {
        return response.status(400).json({ error: 'userId is required' })
      }

      const count = await MemberUser.query()
        .where('id_user', userId)
        .count('* as total')

      const exists = parseInt(count[0].$extras.total as string, 10) > 0
      return response.status(200).json({ exists })
    } catch (err) {
      console.error('Failed to check member users existence:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async uploadCsv({ request, response }: HttpContextContract) {
    try {
      const file = request.file('file')
      const userId = request.input('userId')

      if (!file) {
        return response.status(400).json({ error: 'No file uploaded' })
      }

      if (!userId) {
        return response.status(400).json({ error: 'userId is required' })
      }

      // Validate file type
      if (!file.extname || file.extname.toLowerCase() !== 'csv') {
        return response.status(400).json({ error: 'Only CSV files are allowed' })
      }

      // Read and parse CSV
      const csvData: any[] = []

      // Read file content using fs
      const fs = require('fs').promises
      const fileContent = await fs.readFile(file.tmpPath!, 'utf8')

      const lines = fileContent.split('\n').filter(line => line.trim() !== '')
      if (lines.length < 2) {
        return response.status(400).json({ error: 'CSV file must have at least a header and one data row' })
      }

      // Parse CSV headers
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const expectedHeaders = ['username', 'password', 'status', 'section']
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h))

      if (missingHeaders.length > 0) {
        return response.status(400).json({ error: `Missing required columns: ${missingHeaders.join(', ')}` })
      }

      // Parse data rows
      const dataRows = lines.slice(1)

      for (let i = 0; i < dataRows.length; i++) {
        const values = dataRows[i].split(',').map(v => v.trim())
        if (values.length >= expectedHeaders.length) {
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          csvData.push(row)
        }
      }

      // Prepare data for insertion
      const memberUsersData = csvData.map(row => ({
        username: row.username,
        password: row.password,
        status: row.status,
        section: row.section,
        idUser: userId
      }))



      // Insert data in batches to avoid memory issues
      const batchSize = 100
      for (let i = 0; i < memberUsersData.length; i += batchSize) {
        const batch = memberUsersData.slice(i, i + batchSize)
        await (MemberUser as any).createMany(batch)
      }

      return response.created({ message: `${memberUsersData.length} member users uploaded successfully` })
    } catch (error) {
      console.error('Error processing CSV:', error)

      // Handle database constraint errors
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        const match = error.detail?.match(/Key \(([^)]+)\)=\(([^)]+)\) already exists/)
        if (match) {
          const field = match[1]
          const value = match[2]
          return response.status(400).json({ error: `${field} '${value}' already exists` })
        }
        return response.status(400).json({ error: 'Duplicate entry found' })
      }

      // Handle other database errors
      if (error.message) {
        return response.status(500).json({ error: error.message })
      }

      return response.status(500).json({ error: 'Failed to process CSV file' })
    }
  }
}
