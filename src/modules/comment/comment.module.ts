import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from '../../shared/database/models/customer.model';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from 'src/shared/database/models/comment.model';
import { Product } from 'src/shared/database/models/product.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Comment, Product]), 
        ResponseModule,
        AuthModule,
    ],
    providers: [CommentService, CommentController],
    controllers: [CommentController],
    exports: [CommentController, CommentService],
})
export class CommentModule { }
