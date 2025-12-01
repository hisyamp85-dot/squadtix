import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs/promises'
import path from 'path'

type StoreShape = {
  [eventId: string]: {
    [categoryId: string]: number
  }
}

const storePath = Application.tmpPath('entry_amounts.json')

async function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
}

export default class EntryAmountStore {
  static async read(): Promise<StoreShape> {
    try {
      const content = await fs.readFile(storePath, 'utf8')
      if (!content.trim()) return {}
      return JSON.parse(content) as StoreShape
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return {}
      }
      throw error
    }
  }

  static async write(data: StoreShape) {
    await ensureDirExists(storePath)
    await fs.writeFile(storePath, JSON.stringify(data, null, 2), 'utf8')
  }

  static async getEventMap(eventId: string): Promise<Record<string, number>> {
    const all = await this.read()
    return all[eventId] || {}
  }

  static async setEntryAmount(eventId: string, categoryId: string, amount: number) {
    const all = await this.read()

    if (!all[eventId]) {
      all[eventId] = {}
    }

    all[eventId][categoryId] = amount

    await this.write(all)
  }
}
