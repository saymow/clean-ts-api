import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hash')
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

  test('Should throw if Bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()) as any)

    await expect(sut.hash('any_value')).rejects.toThrow()
  })
})
