CREATE INDEX "chapters_subject_id_idx" ON "all_chapters_for_each_subject" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "all_subjects_user_id_idx" ON "all_subjects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "todos_user_id_idx" ON "todos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "todos_created_at_idx" ON "todos" USING btree ("created_at");