import { Injectable } from '@nestjs/common';
import { PrismaClient, RepairStatus } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class DashboardService {
  async getDashboardData(userId: string) {
    // Total bookings (all repairs as customer)
    const totalBookings = await prisma.repair.count({
      where: { customerId: userId },
    });

    // In progress repairs
    const inProgress = await prisma.repair.count({
      where: { customerId: userId, status: RepairStatus.IN_PROGRESS },
    });

    // Completed repairs
    const completed = await prisma.repair.count({
      where: { customerId: userId, status: RepairStatus.COMPLETED },
    });

    // Revenue from completed repairs
    const revenueResult = await prisma.repair.aggregate({
      where: { customerId: userId, status: RepairStatus.COMPLETED },
      _sum: { actualCost: true },
    });
    const revenue = revenueResult._sum.actualCost || 0;

    return {
      totalBookings,
      inProgress,
      completed,
      revenue,
    };
  }

  async getAdminDashboardData() {
    // Total bookings (all repairs)
    const totalBookings = await prisma.repair.count();

    // In progress repairs
    const inProgress = await prisma.repair.count({
      where: { status: RepairStatus.IN_PROGRESS },
    });

    // Completed repairs
    const completed = await prisma.repair.count({
      where: { status: RepairStatus.COMPLETED },
    });

    // Revenue from completed repairs
    const revenueResult = await prisma.repair.aggregate({
      where: { status: RepairStatus.COMPLETED },
      _sum: { actualCost: true },
    });
    const revenue = revenueResult._sum.actualCost || 0;

    return {
      totalBookings,
      inProgress,
      completed,
      revenue,
    };
  }
} 