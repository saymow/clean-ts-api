import { Hasher } from '@/data/protocols/cryptography/hasher'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import faker from 'faker'

export class HasherSpy implements Hasher {
  digest = faker.random.uuid()
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.digest)
  }
}

export class DecrypterSpy implements Decrypter {
  plaintext: string
  digest = faker.random.uuid()

  async decrypt (token: string): Promise<string> {
    this.plaintext = token
    return this.digest
  }
}

export class EncrypterSpy implements Encrypter {
  plaintext: string
  ciphertext = faker.random.uuid()

  async encrypt (value: string): Promise<string> {
    this.plaintext = value
    return await Promise.resolve(this.ciphertext)
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string
  digest: string
  isValid = true

  async compare (value: string, hash: string): Promise<boolean> {
    this.plaintext = value
    this.digest = hash
    return await Promise.resolve(this.isValid)
  }
}
