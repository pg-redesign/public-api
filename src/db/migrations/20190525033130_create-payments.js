/* eslint func-names:0 */

exports.up = function (knex) {
  return knex.schema.createTable("payments", (table) => {
    table.increments();
    table
      .integer("course_id")
      .unsigned()
      .notNullable()
      .references("courses.id")
      .onDelete("CASCADE");
    table
      .integer("student_id")
      .unsigned()
      .notNullable()
      .references("students.id")
      .onDelete("CASCADE");
    table
      .enu("type", ["credit", "check"], { useNative: true, enumName: "payment_type" })
      .notNullable();
    table.integer("amount").notNullable();
    table.datetime("invoice_date").notNullable();
    table.datetime("payment_date").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("payments");
};

// exports.config = { transaction: false };
