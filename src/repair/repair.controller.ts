import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RoleGuard } from '../guard/role.guard';
import { Role } from '../decorator/role.decorator';

@UseGuards(SupabaseAuthGuard, RoleGuard)
@Controller('repairs')
export class RepairsController {
  @Patch(':id/confirm')
  @Role('admin')
  async confirmRepair(@Param('id') id: string) {
    // TODO: Implement actual confirmation logic
    return { success: true, message: `Repair ${id} confirmed by admin.` };
  }
} 