import { Controller, Get, UseGuards, Req, Logger, Post, Res, UseInterceptors } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { UserService } from '../user/user.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookInterceptor } from './webhook.interceptor';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current user', 
    description: 'Returns the currently authenticated user. Requires a valid Supabase JWT in the Authorization header. Creates user in database if not exists.' 
  })
  @ApiResponse({ status: 200, description: 'Current user info returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid or missing token.' })
  @UseGuards(SupabaseAuthGuard)
  async getMe(@Req() req) {
    const supabaseUser = req.user;
    this.logger.log(`Processing user sync for: ${supabaseUser.email}`);
    
    try {
      let user = await this.userService.findByEmail(supabaseUser.email);
      
      if (!user) {
        this.logger.log(`Creating new user for: ${supabaseUser.email}`);
        user = await this.userService.createUser({
          id: supabaseUser.sub, // Supabase user ID
          email: supabaseUser.email,
          firstName: supabaseUser.user_metadata?.full_name?.split(" ")[0] || "",
          lastName: supabaseUser.user_metadata?.full_name?.split(" ")[1] || "",
          phone: supabaseUser.user_metadata?.phone || null,
        });
        this.logger.log(`User created successfully: ${user.id}`);
      } else {
        this.logger.log(`User found in database: ${user.id}`);
      }
      
      return { 
        user,
        message: 'User authenticated and synced successfully'
      };
    } catch (error) {
      this.logger.error(`Error syncing user ${supabaseUser.email}:`, error);
      throw error;
    }
  }

  @Post('webhook')
  @UseInterceptors(WebhookInterceptor)
  async handleSupabaseWebhook(@Req() req, @Res() res) {
    this.logger.log('Received Supabase Auth webhook:', req.body);
    // You can add custom logic here to process the webhook event
    return res.status(200).send({ received: true });
  }
}