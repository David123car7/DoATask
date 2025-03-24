import { Controller, Get, UseGuards, Req, Post, Body, Param} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';


//@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    

    @Get("me")
    getMe(@GetUser() user: User){
        return user;
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
      return this.userService.getUserById(id);
    }

    @Post('message') 
     receiveMessage(@Body() body: { message: string }) {
     const receivedMessage = body.message; // Extract the message from the request body
     console.log('Received message:', receivedMessage); // Log the message to the console
 
     // Send a response back to the frontend
     return { message: `Backend received: ${receivedMessage}` };
     }
}
