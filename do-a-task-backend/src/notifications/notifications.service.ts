import { Injectable} from '@nestjs/common';
import {WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
  
@WebSocketGateway({cors: { origin: process.env.NEXT_FRONTEND_URL, credentials: true}})
@Injectable()
export class NotificationsService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private users = new Map<string, string>(); 
  
    handleConnection(client: Socket) {
      const token = client.handshake.auth.token;
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET); 
        const userId = decoded.sub;
        this.users.set(userId, client.id);
        console.log(`User ${userId} connected with socket ID ${client.id}`);
      } catch (e) {
        console.log('JWT verification failed:', e);
        client.disconnect();
      }
    }
  
    handleDisconnect(client: Socket) {
      const userId = [...this.users.entries()]
        .find(([_, socketId]) => socketId === client.id)?.[0];
  
      if (userId) {
        this.users.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
  
    sendToUser(userId: string, message: string) {
      const socketId = this.users.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('notification', { message });
      } else {
        console.log(`No active connection for user ${userId}`);
      }
    }
}