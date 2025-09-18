-- Create the new association table
CREATE TABLE faculty_batch_association (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    batch_id BIGINT NOT NULL,
    association_date DATETIME NOT NULL,
    CONSTRAINT fk_association_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    CONSTRAINT fk_association_batch FOREIGN KEY (batch_id) REFERENCES faculty_upload_batch(id) ON DELETE CASCADE,
    UNIQUE KEY uk_faculty_batch (faculty_id, batch_id)
);

-- Populate the new association table from the existing foreign key
-- This assumes the old column was named `batch_id` in the `faculty` table
INSERT INTO faculty_batch_association (faculty_id, batch_id, association_date)
SELECT id, batch_id, NOW()
FROM faculty
WHERE batch_id IS NOT NULL;

-- Remove the old foreign key column from the faculty table
-- Note: Check for foreign key constraint name if it exists and drop it first
-- For example: ALTER TABLE faculty DROP FOREIGN KEY <constraint_name>;
ALTER TABLE faculty DROP COLUMN batch_id;
