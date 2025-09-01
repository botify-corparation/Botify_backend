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
      const admins = [
        {
          fullName: 'Tuxtasinboyev Omadbek',
          email: 'omadbektuxtasinboyev06@gmail.com',
          phone: '+998908330183',
          password: 'OMADBEK007',
        },
        {
          fullName: 'Ibrohimov Zafar',
          email: 'ibragimovzafar001@gmail.com',
          phone: '+998901112233',
          password: 'ZAFAR007',
        },
      ];

      for (const adminData of admins) {
        const { fullName, email, phone, password } = adminData;
        const role = UserRole.ADMIN;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await this.prisma.user.findUnique({ where: { email } });

        if (existingUser) {
          await this.prisma.user.update({
            where: { email },
            data: {
              fullName,
              phone,
              password: hashedPassword,
              isActive: true,
              role,
            },
          });

          this.logger.log(`⚠️ Admin already exists. Updated: ${email}`);
        } else {
          const newUser = await this.prisma.user.create({
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

          this.logger.log(`✅ Admin created successfully: ${newUser.email}`);
        }
      }
    } catch (error) {
      this.logger.error('❌ Seeder error occurred', error);
    }
  }

}
