import { createConnection, Connection } from 'typeorm';

export class ConnectionFactory {
    public GetConnection(): Promise<Connection> {
        return createConnection();
    }
}
