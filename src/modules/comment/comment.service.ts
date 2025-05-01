import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/shared/database/models/comment.model";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { Product } from "src/shared/database/models/product.model";
import { where } from "sequelize";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment) private readonly commentModel: typeof Comment,
        @InjectModel(Product) private readonly productModel: typeof Product
    ) {
    }

    async isCommented(userId: string, productId: string) {
        const comment = await this.commentModel.findOne({
            where: {
                customerId: userId,
                productId: productId
            },
        });
        return comment;
    }

    async createComment(dto: CreateCommentDto, userId?: string) {
        if (!userId) {
            const comment = await this.commentModel.create({
                customerId: null,
                content: dto.content,
                productId: dto.productId,
            });
            return comment;
        } else {
            const isCommented = await this.isCommented(userId, dto.productId);
            if (isCommented) {
                throw new Error("You have already commented on this product");
            }
            const comment = await this.commentModel.create({
                customerId: userId,
                content: dto.content,
                rate: dto.rate,
                productId: dto.productId,
            });
            const comments = await this.commentModel.findAll({
                where: {
                    productId: dto.productId
                }
            });
            const totalRate = comments.map((cmt) => {
                const commentPlain = cmt.get?.({ plain: true }) || cmt;
                console.log(commentPlain.rate);
                return commentPlain.rate;
            }).reduce((total, rate) => total + rate, 0);
            await this.productModel.update(
                { rate: (totalRate) / (comments.length) },
                { where: { id: dto.productId } }
            );
            return comment;
        }
    }
}