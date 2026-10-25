"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: true, unique: true },
      phone: { type: Sequelize.STRING, allowNull: true, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM("CUSTOMER", "ADMIN"), allowNull: false, defaultValue: "CUSTOMER" },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("categories", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("products", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "categories", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      sku: { type: Sequelize.STRING, allowNull: true, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      comparePrice: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      imageUrl: { type: Sequelize.TEXT, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      isFeatured: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("coupons", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      percentOff: { type: Sequelize.INTEGER, allowNull: true },
      amountOff: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      minimumOrder: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      startsAt: { type: Sequelize.DATE, allowNull: true },
      endsAt: { type: Sequelize.DATE, allowNull: true },
      usageLimit: { type: Sequelize.INTEGER, allowNull: true },
      usedCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("addresses", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      name: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      line1: { type: Sequelize.STRING, allowNull: false },
      line2: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: false },
      state: { type: Sequelize.STRING, allowNull: true },
      postalCode: { type: Sequelize.STRING, allowNull: true },
      country: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("orders", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      orderNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
      },
      addressId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "addresses", key: "id" },
        onUpdate: "CASCADE",
      },
      couponId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "coupons", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      status: { type: Sequelize.ENUM("PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"), allowNull: false, defaultValue: "PENDING" },
      paymentStatus: { type: Sequelize.ENUM("UNPAID", "PAID", "FAILED", "REFUNDED"), allowNull: false, defaultValue: "UNPAID" },
      paymentMethod: { type: Sequelize.ENUM("COD", "STRIPE", "SSLCOMMERZ"), allowNull: false, defaultValue: "COD" },
      paymentReference: { type: Sequelize.STRING, allowNull: true },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      discount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      shipping: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      customerNote: { type: Sequelize.TEXT, allowNull: true },
      adminNote: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("orderItems", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "orders", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
      },
      name: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
    });

    await queryInterface.createTable("notificationLogs", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "orders", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      channel: { type: Sequelize.ENUM("WHATSAPP", "SMS"), allowNull: false },
      status: { type: Sequelize.ENUM("SENT", "FAILED"), allowNull: false },
      recipient: { type: Sequelize.STRING, allowNull: false },
      providerId: { type: Sequelize.STRING, allowNull: true },
      error: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.addIndex("products", ["categoryId"]);
    await queryInterface.addIndex("products", ["isActive"]);
    await queryInterface.addIndex("orders", ["userId"]);
    await queryInterface.addIndex("orders", ["status"]);
    await queryInterface.addIndex("orders", ["paymentStatus"]);
    await queryInterface.addIndex("orders", ["createdAt"]);
    await queryInterface.addIndex("orderItems", ["orderId"]);
    await queryInterface.addIndex("notificationLogs", ["orderId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("notificationLogs");
    await queryInterface.dropTable("orderItems");
    await queryInterface.dropTable("orders");
    await queryInterface.dropTable("addresses");
    await queryInterface.dropTable("coupons");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("categories");
    await queryInterface.dropTable("users");

    for (const enumName of [
      "enum_users_role",
      "enum_orders_status",
      "enum_orders_paymentStatus",
      "enum_orders_paymentMethod",
      "enum_notificationLogs_channel",
      "enum_notificationLogs_status",
    ]) {
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}" CASCADE;`);
    }
  },
};
