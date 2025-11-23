import { Controller, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { AuthGuard } from 'src/core/guards/auth.guard';

@UseGuards(AuthGuard, AdminGuard)
@Controller('/api/admin')
export class AdminController {
  constructor() {}
}
