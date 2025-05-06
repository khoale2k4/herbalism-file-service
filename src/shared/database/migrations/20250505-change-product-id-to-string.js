'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Xóa foreign key hiện tại giữa cart_items.productId và products.id
        await queryInterface.removeConstraint('cart_items', 'cart_items_ibfk_2');

        // 2. Đổi kiểu Product.id từ INTEGER sang STRING
        await queryInterface.changeColumn('products', 'id', {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        });

        // 3. Đổi kiểu CartItem.productId từ INTEGER sang STRING
        await queryInterface.changeColumn('cart_items', 'productId', {
            type: Sequelize.STRING,
            allowNull: false,
        });

        // 4. Thêm lại foreign key với kiểu mới
        await queryInterface.addConstraint('cart_items', {
            fields: ['productId'],
            type: 'foreign key',
            name: 'cart_items_ibfk_2',
            references: {
                table: 'products',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        // Khôi phục lại định dạng cũ (nếu cần rollback)
        await queryInterface.removeConstraint('cart_items', 'cart_items_ibfk_2');

        await queryInterface.changeColumn('cart_items', 'productId', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });

        await queryInterface.changeColumn('products', 'id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        });

        await queryInterface.addConstraint('cart_items', {
            fields: ['productId'],
            type: 'foreign key',
            name: 'cart_items_ibfk_2',
            references: {
                table: 'products',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }
};
