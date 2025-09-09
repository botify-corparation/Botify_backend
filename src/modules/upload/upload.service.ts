import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';
import fetch from 'node-fetch';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

interface ImgbbResponse {
  data: {
    url: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

@Injectable()
export class UploadService {
  private readonly IMGBB_API_KEY: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('IMGBB_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('IMGBB_API_KEY environment variable is missing');
    }
    this.IMGBB_API_KEY = apiKey;
  }

  /**
   * Faylni imgbb ga yuklab, user avatar sifatida saqlash
   */
  async uploadToImgbb(filePath: string, userId: number): Promise<{ url: string; delete_url: string }> {
    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.IMGBB_API_KEY}`, {
      method: 'POST',
      body: form,
    });

    const result = (await response.json()) as ImgbbResponse;
    fs.unlinkSync(filePath); // vaqtinchalik faylni o‘chirish

    if (!result.success) throw new NotFoundException('Upload failed');

    const existsUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existsUser) throw new NotFoundException('User not found!');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar: result.data.url, // ✅ tuzatildi
      },
    });

    return {
      url: result.data.url,
      delete_url: result.data.delete_url,
    };
  }

  /**
   * Faylni imgbb ga yuklab, botModel.imageUrl sifatida saqlash
   */
  async uploadToImg(filePath: string, botModelId: number): Promise<{ url: string; delete_url: string }> {
    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.IMGBB_API_KEY}`, {
      method: 'POST',
      body: form,
    });

    const result = (await response.json()) as ImgbbResponse;
    fs.unlinkSync(filePath);

    if (!result.success) throw new NotFoundException('Upload failed');

    const existsBotModel = await this.prisma.botModel.findUnique({ where: { id: botModelId } });
    if (!existsBotModel) throw new NotFoundException('BotModel not found!');

    await this.prisma.botModel.update({
      where: { id: botModelId },
      data: {
        imageUrl: result.data.url, // ✅ tuzatildi
      },
    });

    return {
      url: result.data.url,
      delete_url: result.data.delete_url,
    };
  }

  /**
   * Base64 rasmni imgbb ga yuklash (masalan, frontend to‘g‘ridan-to‘g‘ri base64 yuborsa)
   */
  async uploadImageBase64(base64Image: string): Promise<string> {
    if (!base64Image) {
      throw new BadRequestException('Base64 image is required');
    }

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${this.IMGBB_API_KEY}`,
      { image: base64Image },
    );

    return response.data.data.url;
  }
}
