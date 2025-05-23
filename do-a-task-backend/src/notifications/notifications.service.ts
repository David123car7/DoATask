import { Injectable} from '@nestjs/common';
import {WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import e from 'express';

@WebSocketGateway({cors: { origin: process.env.NEXT_FRONTEND_URL, credentials: true}})
@Injectable()
export class NotificationsService implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private prisma: PrismaService) {}

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

    async sendNotification(userId: string, tittle: string, message: string){
        try{
            const notification = await this.prisma.notification.create({
                data:{
                    title: tittle,
                    message: message,
                    read: false,
                    createdAt: new Date(),
                    recipientId: userId,
                }
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Create Notification",error)
        }

        this.sendToUser(userId, message)
    }

    async countNotifications(userId: string){
      try {
        const notifications = await this.prisma.notification.count({
          where: { 
            recipientId: userId,
            read: false,
          },
        });
        return notifications;
      } catch (error) {
        this.prisma.handlePrismaError("Count Notifications", error);
      }
    }

    async getNotifications(userId: string){
        try{
            const notifications = await this.prisma.notification.findMany({
                where: { 
                    recipientId: userId,
                    read: false,
                },
            });
            return notifications;
        }
        catch(error){
            this.prisma.handlePrismaError("Get Notifications",error)
        }
    }

    async getAllNotifications(userId: string){
      try{
          const notifications = await this.prisma.notification.findMany({
              where: { 
                  recipientId: userId,
              },
          });
          return notifications;
      }
      catch(error){
          this.prisma.handlePrismaError("Get Notifications",error)
      }
  }

    async setNotifications(userId: string) {
        try {
          const updateResult = await this.prisma.notification.updateMany({
            where: {
              recipientId: userId,
              read: false,
            },
            data: {
              read: true,
              //updatedAt: new Date(),
            },
          });
          return updateResult;
        } catch (error) {
          this.prisma.handlePrismaError("Set Notifications", error);
        }
      }
      
}