import { Module } from "@nestjs/common";
import { ArticleController } from "./articles.controller";
import { ConfigModule } from "@nestjs/config";
import { ResponseModule } from "../response/response.module";
import { AuthModule } from "src/auth/auth.module";
import { ArticleService } from "./articles.service";
import { ArticleRepository } from "./article.repository";
import { Article } from "src/shared/database/models/article.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { ArticleCategory } from "src/shared/database/models/article-category.model";

@Module({
    imports: [
        ConfigModule,
        ResponseModule,
        AuthModule,
        SequelizeModule.forFeature([Article, ArticleCategory]), 
    ],
    providers: [ArticleService,ArticleRepository],
    controllers: [ArticleController],
    exports: [ArticleService, ArticleRepository],
})
export class ArticleModule { }
