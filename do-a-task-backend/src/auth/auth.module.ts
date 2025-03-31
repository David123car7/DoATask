import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
              return {
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: 40000 },
              }
            },
            inject: [ConfigService],
          }),
          SupabaseModule,
          PrismaModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard],
    exports: [JwtAuthGuard, JwtModule]
})
export class AuthModule {}