import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'


export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const all_subjects = pgTable('all_subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject_name: text('subject_name').notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const STATUS = pgEnum('status', [
  'COMPLETED',
  'DOING_IT_CURRENTLY',
  'NOT_STARTED',
])


export const all_chapters_for_each_subject = pgTable(
  'all_chapters_for_each_subject',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subject_id: uuid('subject_id')
      .references(() => all_subjects.id, { onDelete: 'cascade' })
      .notNull(),
    chapter_name: text('chapter_name').notNull(),
    chapter_number: text('chapter_number').notNull(),
    compeleted_percentage: text('compeleted_percentage')
      .notNull()
      .default('0%'),
    status: STATUS('status').notNull().default('NOT_STARTED'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
)

export type SubjectsType = typeof all_subjects.$inferSelect
export type StatusType = typeof STATUS.enumValues[number]
export type ChaptersType = typeof all_chapters_for_each_subject.$inferSelect