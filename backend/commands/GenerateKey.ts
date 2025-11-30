import { BaseCommand } from '@adonisjs/core/build/standalone'
import { promises as fs } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

export default class GenerateKey extends BaseCommand {
  public static commandName = 'generate:key'
  public static description = 'Generate APP_KEY dan tulis ke file .env'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run () {
    const newKey = randomBytes(32).toString('hex')
    const envPath = join(this.application.appRoot, '.env')

    try {
      let envContent = ''

      try {
        envContent = await fs.readFile(envPath, 'utf-8')
      } catch {
        envContent = ''
      }

      if (envContent.match(/^APP_KEY=.*/m)) {
        envContent = envContent.replace(/^APP_KEY=.*/m, `APP_KEY=${newKey}`)
      } else {
        if (envContent.length > 0 && !envContent.endsWith('\n')) {
          envContent += '\n'
        }
        envContent += `APP_KEY=${newKey}\n`
      }

      await fs.writeFile(envPath, envContent)

      this.logger.success('APP_KEY baru berhasil dibuat dan disimpan ke .env')
      this.logger.info(`Key: ${newKey}`)
    } catch (error: any) {
      this.logger.error('Gagal menulis APP_KEY ke .env')
      this.logger.info('Ini key yang tadi digenerate, silakan copy manual ke .env:')
      this.logger.info(newKey)
    }
  }
}
