import axios from 'axios'
import { HttpGetClient } from './client'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any> ({ url, params }: HttpGetClient.Input): Promise<T> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
