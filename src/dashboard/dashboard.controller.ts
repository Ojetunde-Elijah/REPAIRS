import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

@UseGuards(SupabaseAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardData(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    if (user.role === 'ADMIN') {
      // Return overall stats for all users
      return this.dashboardService.getAdminDashboardData();
    } else {
      // Return stats for this customer
      return this.dashboardService.getDashboardData(user.id);
    }
  }
} 