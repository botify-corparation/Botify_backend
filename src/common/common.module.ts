import { Module } from "@nestjs/common";
import { GuardsService } from "./guards/guards.service";
import { RoleGuard } from "./role/role.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[JwtModule],
    providers: [GuardsService, RoleGuard],
    exports: [GuardsService, RoleGuard]
})
export class CommonModule { }