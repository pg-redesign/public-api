exports.up = knex => knex.schema.alterTable("payments", (table) => {
  table.string("confirmation_id").nullable();
  table.unique("confirmation_id");
});

exports.down = knex => knex.schema.alterTable("payments", (table) => {
  table.dropColumn("confirmation_id");
});
