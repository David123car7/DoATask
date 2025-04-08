import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthDtoSignup{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    @IsNotEmpty()
    birthDate: string;

    @IsString()
    @IsNotEmpty()
    contactNumber: string

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class AuthDtoSignin{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class AuthDtoChangePassword{
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword2: string;
}

export class AuthDtoResetPassword{
    @IsString()
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword2: string;
}

export class AuthDtoRequestResetPassword{
    @IsEmail()
    @IsNotEmpty()
    email: string;
}