import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
    constructor(private prisma: PrismaService) { }
    async uploadToImgbb(filePath: string, userId: number): Promise<{ url: string; delete_url: string }> {
        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) throw new Error('IMGBB_API_KEY not found');

        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));
        form.append('key', apiKey);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: form,
        });

        const result = await response.json() as ImgbbResponse;

        fs.unlinkSync(filePath);

        if (!result.success) throw new NotFoundException('Upload failed');

        const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!existsUser) throw new NotFoundException('user not found!')
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                avatar: response.url
            }
        })
        return {
            url: result.data.url,
            delete_url: result.data.delete_url,
        };
    }
}
