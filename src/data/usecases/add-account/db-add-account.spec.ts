import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return { sut, encrypterStub }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.execute(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(async () => await Promise.reject(new Error()))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await expect(sut.execute(accountData)).rejects.toThrow()
  })
})
