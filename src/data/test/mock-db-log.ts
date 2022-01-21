import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export class LogErrorRepositorySpy implements LogErrorRepository {
  plaintext: string

  async logError (stack: string): Promise<void> {
    this.plaintext = stack
    return await Promise.resolve()
  }
}
