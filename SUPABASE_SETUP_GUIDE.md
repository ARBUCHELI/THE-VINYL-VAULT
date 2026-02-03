# Supabase Setup Guide for Content Management System

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Supabase CLI installed (`npm install -g supabase`)

## Step-by-Step Setup

### 1. Create a New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details
4. Wait for the project to be provisioned

### 2. Run SQL Migrations

Navigate to SQL Editor in your Supabase dashboard and run the migrations **in this exact order**:

#### Migration 1: Base Schema
File: `supabase/migrations/20251005163813_851ab85f-a597-4246-8849-0ee9422cffce.sql`

This creates:
- User roles enum (admin, editor, reader)
- Profiles table with RLS policies
- User_roles table
- Categories table with default categories
- Posts table with RLS policies
- Tags and post_tags tables
- Comments table with nested replies support
- Triggers for auto-updating timestamps
- Trigger for auto-creating profiles on signup

#### Migration 2: Update Default Role
File: `supabase/migrations/20251006092718_f6897820-4e18-4980-81f1-2f83883876b7.sql`

Changes the default role from 'reader' to 'editor' so new users can create posts.

#### Migration 3: Admin Delete Profiles
File: `supabase/migrations/20251008052917_788bc4d4-1443-41c4-9ac6-54d4d77c9ef2.sql`

Adds policy allowing admins to delete user profiles.

#### Migration 4: Authors Delete Posts
File: `supabase/migrations/20251008055544_ab704e72-be4e-4ce7-af0a-ecf282609cf0.sql`

Updates policy to allow authors to delete their own posts.

#### Migration 5: Increment Post Views
File: `supabase/migrations/20260203000000_increment_post_views.sql`

Adds a function to atomically increment post view counts.

#### Migration 6: Avatar Storage
File: `supabase/migrations/20260203200000_create_avatars_storage.sql`

Creates a storage bucket for user avatars with RLS policies:
- Users can upload, update, and delete their own avatars
- Anyone can view all avatars (public bucket)

### 3. Deploy Edge Functions

```bash
# Login to Supabase
supabase login

# Get your project reference ID from Supabase dashboard (Settings > General)
# Link your local project to Supabase
supabase link --project-ref YOUR_PROJECT_REF

# Deploy each edge function
supabase functions deploy auth-handler
supabase functions deploy profile-handler
supabase functions deploy post-handler
supabase functions deploy comment-handler
supabase functions deploy category-tag-handler
```

### 4. Update Your Frontend Configuration

Update your environment variables with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

You can find these in: Supabase Dashboard > Settings > API

### 5. Test Your Setup

#### Test Authentication
1. Go to your app's signup page
2. Create a new account
3. Verify that a profile is automatically created
4. Check that the user has the 'editor' role

#### Test Post Creation
1. Login with your new account
2. Navigate to the Dashboard
3. Create a new post
4. Verify it appears in the post list

#### Test Row Level Security
1. Try to access another user's draft posts (should fail)
2. Try to delete another user's post (should fail unless admin)
3. Verify published posts are visible to everyone

### 6. Create Your First Admin User

After creating your first user account, manually update their role to admin:

```sql
-- In Supabase SQL Editor
-- Replace 'USER_UUID' with your user's ID (found in Authentication > Users)

DELETE FROM user_roles WHERE user_id = 'USER_UUID';
INSERT INTO user_roles (user_id, role) VALUES ('USER_UUID', 'admin');
```

## Database Schema Overview

### Tables Created

1. **profiles** - User profile information
   - Links to auth.users
   - Auto-created on signup
   - Contains username, full_name, avatar_url, bio

2. **user_roles** - User role assignments
   - Links users to their roles (admin/editor/reader)
   - Default: 'editor' for new users

3. **categories** - Post categories
   - Pre-populated with: Technology, Design, Business, Lifestyle
   - Managed by admins

4. **posts** - Blog posts
   - Status: draft, published, archived
   - Tracks views, publication date
   - Links to author and category

5. **tags** - Post tags
   - Created by any authenticated user
   - Many-to-many relationship with posts

6. **post_tags** - Junction table for posts and tags

7. **comments** - Post comments
   - Supports nested replies (parent_id)
   - Links to post and author

## Row Level Security (RLS) Policies

All tables have RLS enabled with the following access patterns:

### Profiles
- ✅ Everyone can view
- ✅ Users can update their own profile
- ✅ Users can create their own profile
- ✅ Admins can delete profiles

### Posts
- ✅ Published posts visible to everyone
- ✅ Authors see their own drafts
- ✅ Editors/admins see all posts
- ✅ Editors can create posts
- ✅ Authors can update their own posts
- ✅ Authors and admins can delete posts

### Comments
- ✅ Everyone can view
- ✅ Authenticated users can create
- ✅ Users can update their own comments
- ✅ Users can delete their own comments
- ✅ Admins can delete any comment

### Categories
- ✅ Everyone can view
- ✅ Only admins can create/update/delete

### Tags
- ✅ Everyone can view
- ✅ Authenticated users can create

## Edge Functions vs Direct Database Access

You have two options for interacting with your database:

### Option 1: Direct Database Access (Current Method)
Your frontend currently uses the Supabase client to directly query tables:

```typescript
await supabase.from('posts').select('*')
```

**Pros:**
- Simple and straightforward
- Real-time subscriptions available
- Automatic RLS enforcement

**Cons:**
- Business logic in frontend
- Harder to maintain complex operations

### Option 2: Edge Functions (Recommended for Complex Operations)
Use edge functions for complex business logic:

```typescript
await callEdgeFunction('post-handler', 'create-post', postData, token)
```

**Pros:**
- Centralized business logic
- Better for complex operations
- Easier to test and maintain

**Cons:**
- Additional latency
- More setup required

**Recommendation:** Use direct database access for simple CRUD operations and edge functions for complex business logic, batch operations, or when you need server-side processing.

## Troubleshooting

### "Permission denied" errors
- Check that RLS policies are applied correctly
- Verify user has the correct role
- Ensure user is authenticated

### Edge functions not deploying
- Verify Supabase CLI is installed: `supabase --version`
- Check you're logged in: `supabase login`
- Verify project is linked: `supabase projects list`

### Profile not created on signup
- Check the `handle_new_user()` trigger is active
- Verify trigger is attached to auth.users table
- Check Supabase logs for errors

### Posts not showing up
- Verify post status is 'published'
- Check RLS policies allow viewing
- Ensure published_at is set for published posts

## Next Steps

1. ✅ Run all migrations (including avatar storage)
2. ✅ Deploy edge functions (optional)
3. ✅ Create your admin user
4. ✅ Test authentication flow
5. ✅ Test avatar upload functionality
6. ✅ Create sample posts
7. ✅ Test commenting system
8. Configure email templates (Settings > Auth > Email Templates)
9. Configure custom domain (optional)

## Support

For issues with:
- **Supabase setup:** https://supabase.com/docs
- **Edge functions:** https://supabase.com/docs/guides/functions
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

Happy coding! 🚀
