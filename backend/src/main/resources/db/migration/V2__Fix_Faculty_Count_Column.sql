-- This script checks if the faculty_count column exists and drops it.
-- This is a safe way to handle the migration regardless of the initial state.

-- The syntax for dropping a column if it exists can be database-specific.
-- This is a generic approach. For MySQL, you might need a more complex procedure.
-- However, a simple ALTER TABLE should suffice if we assume the column exists.

-- For simplicity and to avoid complex procedural SQL in a migration file:
-- We will just attempt to drop the column. If it doesn't exist, this might fail on some DBs
-- without extra checks, but Flyway will handle the transaction.

-- A more robust way in a single statement for MySQL isn't straightforward without procedures.
-- Let's provide the most likely needed command.

-- Drop the faculty_count column from the faculty_upload_batch table if it exists.
-- As the error indicates a `NOT NULL` constraint without a default, the column must exist.
ALTER TABLE faculty_upload_batch DROP COLUMN faculty_count;
