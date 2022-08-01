export const createTableCarts = async (knex, nameTable) => {
    try {
        return await knex.schema.createTableIfNotExists(nameTable, table => {
            table.increments('id').primary();
            table.timestamp('timestamp').defaultTo(knex.fn.now()).notNullable();
        });
    } catch (error) {
        console.log(error);
    }
};