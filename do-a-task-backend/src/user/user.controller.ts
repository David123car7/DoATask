import { Controller, Get, UseGuards, Req, Post, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JwtGuard } from '../auth/guard';

@Controller('user')
export class UserController {

    @UseGuards(JwtGuard)
    @Get("me")
    getMe(@GetUser() user: User){
        return user;
    }

    @Post('message') // New POST endpoint
    receiveMessage(@Body() body: { message: string }) {
    const receivedMessage = body.message; // Extract the message from the request body
    console.log('Received message:', receivedMessage); // Log the message to the console

    // Send a response back to the frontend
    return { message: `Backend received: ${receivedMessage}` };
    }
}
