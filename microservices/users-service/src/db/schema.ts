import { date, decimal, integer, pgTable, smallint, varchar } from "drizzle-orm/pg-core";


export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  edad: smallint('edad').notNull(),
  sexo: varchar('sexo', { length: 1 }).notNull(),
  altura_cm: integer('altura_cm'),
  peso_kg: decimal('peso_kg'),
  fecha_registro: date('fecha_registro').defaultNow()
})

