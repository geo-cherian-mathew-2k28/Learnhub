-- RUN THIS IN THE SUPABASE SQL EDITOR TO CLEAR DEMO DATA

-- Clear user progress
TRUNCATE TABLE user_progress;

-- Clear profiles (excluding you if you want, but this clears all)
-- TRUNCATE TABLE profiles CASCADE;

-- If you want to delete all users from auth.users, you should do it through the Supabase Dashboard
-- as TRUNCATE on profiles might fail due to foreign key constraints if users still exist in auth.users.
-- However, purging profiles is often enough to reset the leaderboard.

DELETE FROM profiles WHERE id IS NOT NULL;
