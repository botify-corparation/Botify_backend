import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRole, } from '@prisma/client';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedersService implements OnModuleInit {
  private logger = new Logger(SeedersService.name);

  constructor(private prisma: PrismaService) { }

  async onModuleInit() {
    await this.generateSeeder();
  }

  async generateSeeder() {
    try {
      const fullName = 'Tuxtasinboyev Omadbek';
      const email = 'omadbektuxtasinboyev06@gmail.com';
      const phone = '+998908330183';
      const password = 'OMADBEK007';
      const role = UserRole.ADMIN;

      const hashedPassword = await bcrypt.hash(password, 10);
      const exists = await this.prisma.user.findUnique({ where: { email } });
      if (exists) {
        await this.prisma.user.update({
          where: { email }, data: {
            fullName,
            email,
            isActive: true,
            password:hashedPassword,
            phone,
            role,
          }
        })
        this.logger.log('Admin already exists. Skipping...');
        return;
      }

      
      const admin = await this.prisma.user.create({
        data: {
          fullName,
          email,
          phone,
          password: hashedPassword,
          role,
          isActive: true,
          profile: {
            create: {
              isActive: true,
              status: 'ACTIVE',
            },
          },
        },
        include: { profile: true },
      });

      this.logger.log(`✅ Admin created successfully: ${admin.phone}`);
    } catch (error) {
      this.logger.error('❌ Seeder error occurred', error);
    }
  }
}
