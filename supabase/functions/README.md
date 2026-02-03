# Supabase Edge Functions for Content Management System

## Migration Order

Run the SQL migrations in the following order in Supabase SQL Editor:

1. **20251005163813_851ab85f-a597-4246-8849-0ee9422cffce.sql** - Base schema (creates all tables, policies, triggers)
2. **20251006092718_f6897820-4e18-4980-81f1-2f83883876b7.sql** - Changes default role to 'editor'
3. **20251008052917_788bc4d4-1443-41c4-9ac6-54d4d77c9ef2.sql** - Admin delete profiles policy
4. **20251008055544_ab704e72-be4e-4ce7-af0a-ecf282609cf0.sql** - Authors delete own posts policy
5. **20260203000000_increment_post_views.sql** - Increment post views function

## Deploying Edge Functions

To deploy these edge functions to Supabase:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy auth-handler
supabase functions deploy profile-handler
supabase functions deploy post-handler
supabase functions deploy comment-handler
supabase functions deploy category-tag-handler
```

## Edge Functions Overview

### 1. auth-handler
Handles authentication operations.

**Endpoint:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/auth-handler`

**Actions:**
- `signup` - Register new user
- `login` - Login user
- `logout` - Logout user
- `reset-password` - Send password reset email
- `update-password` - Update user password

**Example Usage:**
```typescript
const response = await fetch('YOUR_FUNCTION_URL/auth-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${YOUR_ANON_KEY}`
  },
  body: JSON.stringify({
    action: 'signup',
    data: {
      email: 'user@example.com',
      password: 'securepassword',
      username: 'johndoe',
      full_name: 'John Doe'
    }
  })
})
```

---

### 2. profile-handler
Handles user profile operations.

**Endpoint:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/profile-handler`

**Actions:**
- `get-profile` - Get profile by user ID
- `get-profile-by-username` - Get profile by username
- `update-profile` - Update profile
- `get-user-roles` - Get user roles
- `get-all-profiles` - Get all profiles (admin)
- `update-user-role` - Update user role (admin)
- `delete-profile` - Delete profile (admin)

**Example Usage:**
```typescript
const response = await fetch('YOUR_FUNCTION_URL/profile-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'update-profile',
    data: {
      userId: 'user-uuid',
      updates: {
        full_name: 'John Smith',
        bio: 'Software developer'
      }
    }
  })
})
```

---

### 3. post-handler
Handles post CRUD operations.

**Endpoint:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-handler`

**Actions:**
- `create-post` - Create new post
- `update-post` - Update existing post
- `delete-post` - Delete post
- `get-post` - Get post by ID
- `get-post-by-slug` - Get post by slug (increments views)
- `get-all-posts` - Get all posts with filters
- `get-published-posts` - Get published posts
- `search-posts` - Search posts by title/content
- `get-user-posts` - Get posts by specific user

**Example Usage:**
```typescript
// Create post
const response = await fetch('YOUR_FUNCTION_URL/post-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'create-post',
    data: {
      title: 'My First Post',
      slug: 'my-first-post',
      content: 'This is the content...',
      excerpt: 'A brief summary',
      cover_image: 'https://example.com/image.jpg',
      author_id: 'author-uuid',
      category_id: 'category-uuid',
      status: 'published'
    }
  })
})

// Get published posts with pagination
const response = await fetch('YOUR_FUNCTION_URL/post-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'get-published-posts',
    data: {
      limit: 10,
      offset: 0
    }
  })
})
```

---

### 4. comment-handler
Handles comment operations.

**Endpoint:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/comment-handler`

**Actions:**
- `create-comment` - Create new comment
- `update-comment` - Update comment
- `delete-comment` - Delete comment
- `get-post-comments` - Get all comments for a post (includes replies)
- `get-comment` - Get single comment

**Example Usage:**
```typescript
// Create comment
const response = await fetch('YOUR_FUNCTION_URL/comment-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'create-comment',
    data: {
      post_id: 'post-uuid',
      author_id: 'author-uuid',
      content: 'Great article!',
      parent_id: null // or parent comment UUID for replies
    }
  })
})

// Get post comments
const response = await fetch('YOUR_FUNCTION_URL/comment-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'get-post-comments',
    data: {
      postId: 'post-uuid'
    }
  })
})
```

---

### 5. category-tag-handler
Handles categories and tags operations.

**Endpoint:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/category-tag-handler`

**Actions:**

**Categories:**
- `create-category` - Create category (admin)
- `update-category` - Update category (admin)
- `delete-category` - Delete category (admin)
- `get-all-categories` - Get all categories
- `get-category` - Get category by ID
- `get-category-by-slug` - Get category by slug

**Tags:**
- `create-tag` - Create tag
- `get-all-tags` - Get all tags
- `get-tag` - Get tag by ID

**Post Tags:**
- `add-post-tag` - Add tag to post
- `remove-post-tag` - Remove tag from post
- `get-post-tags` - Get all tags for a post
- `update-post-tags` - Replace all tags for a post

**Example Usage:**
```typescript
// Create category (admin only)
const response = await fetch('YOUR_FUNCTION_URL/category-tag-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    action: 'create-category',
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Tech articles'
    }
  })
})

// Update post tags
const response = await fetch('YOUR_FUNCTION_URL/category-tag-handler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    action: 'update-post-tags',
    data: {
      postId: 'post-uuid',
      tagIds: ['tag-uuid-1', 'tag-uuid-2', 'tag-uuid-3']
    }
  })
})
```

---

## Response Format

All edge functions return responses in the following format:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "count": 10 // only for paginated queries
}
```

**Error:**
```json
{
  "error": "Error message"
}
```

---

## Frontend Integration Example

Create a helper file in your frontend:

```typescript
// src/lib/edgeFunctions.ts
const EDGE_FUNCTION_URL = 'https://YOUR_PROJECT_REF.supabase.co/functions/v1'

export async function callEdgeFunction(
  functionName: string,
  action: string,
  data: any,
  token?: string
) {
  const response = await fetch(`${EDGE_FUNCTION_URL}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : `Bearer ${YOUR_ANON_KEY}`
    },
    body: JSON.stringify({ action, data })
  })
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  return result
}

// Usage in component
import { callEdgeFunction } from '@/lib/edgeFunctions'
import { supabase } from '@/integrations/supabase/client'

async function createPost(postData) {
  const { data: { session } } = await supabase.auth.getSession()
  
  const result = await callEdgeFunction(
    'post-handler',
    'create-post',
    postData,
    session?.access_token
  )
  
  return result.data
}
```

---

## Security Notes

1. **Authentication**: Always pass the user's access token in the Authorization header for protected operations
2. **Row Level Security (RLS)**: All database operations respect the RLS policies defined in migrations
3. **CORS**: Edge functions are configured to accept requests from any origin (update `corsHeaders` if needed)
4. **Role-based Access**: Admin operations check for `admin` role via RLS policies

---

## Environment Variables

The edge functions automatically have access to:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your anonymous/public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (use with caution)

No additional configuration needed!
