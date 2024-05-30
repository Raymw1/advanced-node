import { createConnection, getConnection, getConnectionManager } from 'typeorm'

export class PgConnection {
  private static instance: PgConnection | undefined

  private constructor () {}

  static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    const connection = getConnectionManager().has('default') ? getConnection() : await createConnection()
    connection.createQueryRunner()
  }
}
