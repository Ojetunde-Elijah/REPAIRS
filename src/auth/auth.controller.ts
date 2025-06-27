import {Controller,Post,Body,Headers,UseInterceptors, BadRequestException, UnauthorizedException} from "@nestjs/common"
import { SupabaseService } from "../supabase/supabase.service";
import { WebhookInterceptor } from "./webhook.interceptor";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcryptjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private readonly supabase: SupabaseService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ){}

    @Post("signup")
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ schema: { example: { email: 'user@example.com', password: 'pass123', firstName: 'John', lastName: 'Doe', phone: '+1234567890' }}})
    @ApiResponse({ status: 201, description: 'User created' })
    @ApiResponse({ status: 400, description: 'User already exists or missing fields' })
    async signup(@Body() body: any) {
        const { email, password, firstName, lastName, phone } = body;
        if (!email || !password) {
            throw new BadRequestException('Email and password are required');
        }
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userService.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: firstName || '',
                lastName: lastName || '',
                phone: phone || null,
            }
        });
        return { message: 'User created', user: { id: user.id, email: user.email } };
    }

    @Post("login")
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ schema: { example: { email: 'user@example.com', password: 'pass123' }}})
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() body: any) {
        const { email, password } = body;
        if (!email || !password) {
            throw new BadRequestException('Email and password are required');
        }
        const user = await this.userService.findByEmail(email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        return { message: 'Login successful', token, user: { id: user.id, email: user.email } };
    }

    @Post("webhook")
    @ApiOperation({ summary: 'Handle auth webhooks from external services' })
    @ApiBody({ schema: { example: { type: 'user.created', user: { id: 'uuid', email: 'user@example.com' }}}})
    @ApiResponse({ status: 201, description: 'Webhook processed' })
    @UseInterceptors(WebhookInterceptor)
    async handleAuthWebhook(@Body() body: any){
        const {type, user} = body;
        switch(type){
            case "user.created":
                await this.handleUserCreated(user);
                break;
            case "user.updated":
                await this.handleUserUpdated(user);
                break;
            case "user.deleted":
                await this.handleUserDeleted(user);
                break;
        }
    }
    private async handleUserCreated(user: any){
        await this.userService.createUser(user);
    }
    private async handleUserUpdated(user: any){
        await this.userService.updateUser(user);
    }
    private async handleUserDeleted(user: any){
        await this.userService.deleteUser(user.id);
    }
}