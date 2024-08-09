import { Injectable } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

@Injectable()
export class ConnectionsManagerService {
  public connections: Map<string, ServerResponse<IncomingMessage>> = new Map();

  public getConnection(connectionId: string) {
    return this.connections.get(connectionId);
  }

  public closeConnection(connectionId: string) {
    const connection = this.connections.get(connectionId);
    connection.end();
    this.connections.delete(connectionId);
  }

  public addConnection(
    connectionId: string,
    res: ServerResponse<IncomingMessage>,
  ) {
    this.connections.set(connectionId, res);
  }

  public getConnections() {
    return Array.from(this.connections).map(([id, response]) => ({
      id,
      response,
    }));
  }
}
