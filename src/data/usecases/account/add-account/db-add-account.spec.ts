import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/data/test'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { DbAddAccount } from './db-add-account'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.accountModel = null
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)

  return { sut, hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy }
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
      password: hasherSpy.digest
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError)

    await expect(sut.execute(mockAddAccountParams())).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const bool = await sut.execute(mockAddAccountParams())

    expect(bool).toBeTruthy()
  })

  test('Should return false if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()
    const bool = await sut.execute(mockAddAccountParams())

    expect(bool).toBeFalsy()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.execute(mockAddAccountParams())

    expect(loadAccountByEmailRepositorySpy.plaintext).toBe(mockAddAccountParams().email)
  })
})
