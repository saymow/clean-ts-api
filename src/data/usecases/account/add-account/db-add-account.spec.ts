import { AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy, HasherSpy } from '@/data/test'
import { mockAddAccountParams, throwError } from '@/domain/test'
import { DbAddAccount } from './db-add-account'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  checkAccountByEmailRepositorySpy.result = false
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)

  return { sut, hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    await sut.execute(mockAddAccountParams())

    expect(hasherSpy.plaintext).toEqual(mockAddAccountParams().password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementation(throwError)

    await expect(sut.execute(mockAddAccountParams())).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, hasherSpy, addAccountRepositorySpy } = makeSut()
    await sut.execute(mockAddAccountParams())

    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: hasherSpy.result
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError)

    await expect(sut.execute(mockAddAccountParams())).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(mockAddAccountParams())

    expect(result).toBeTruthy()
  })

  test('Should return false if LoadAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const result = await sut.execute(mockAddAccountParams())

    expect(result).toBeFalsy()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    await sut.execute(mockAddAccountParams())

    expect(checkAccountByEmailRepositorySpy.email).toBe(mockAddAccountParams().email)
  })
})
