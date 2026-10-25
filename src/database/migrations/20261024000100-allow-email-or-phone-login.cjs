"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    const indexes = await queryInterface.showIndex("users");
    const hasPhoneUnique = indexes.some(
      (index) => index.unique && index.fields?.some((field) => field.attribute === "phone")
    );

    if (!hasPhoneUnique) {
      await queryInterface.addIndex("users", ["phone"], {
        name: "users_phone_unique",
        unique: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("users", "users_phone_unique").catch(() => {});

    // Reverting email to NOT NULL can fail when phone-only users exist,
    // so keep it nullable on rollback to protect existing customer records.
    await queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },
};
