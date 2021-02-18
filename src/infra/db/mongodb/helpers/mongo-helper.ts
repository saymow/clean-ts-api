import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  url: null as unknown as string,

  async connect (uri: string): Promise<void> {
    this.url = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    console.log(this.client)
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  },

  map (document: any): any {
    const { _id, ...documentWithoutId } = document
    return Object.assign({}, documentWithoutId, { id: _id })
  }
}
