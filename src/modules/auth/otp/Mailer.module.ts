import { Module } from "@nestjs/common";
import { MailesService } from "./Mailer.service";
import { ConfigModule } from "@nestjs/config";
import { MailesController } from "./Mailer.controler";
import { RedisModule } from "src/core/config/redis/redis.module";

@Module({
    imports: [ConfigModule,RedisModule],
    controllers: [MailesController],
    providers: [MailesService],
    exports: [MailesService]
})
export class MailesModule { }