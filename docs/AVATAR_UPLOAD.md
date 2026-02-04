# Avatar Upload Feature

## Overview
Users can now upload profile pictures (avatars) to personalize their accounts. Images are stored securely in Supabase Storage with proper access controls.

## Setup Required

### 1. Run the Storage Migration
In Supabase SQL Editor, run this migration **after the first 5 migrations**:

**File:** `supabase/migrations/20260203200000_create_avatars_storage.sql`

This creates:
- A public storage bucket named `avatars`
- RLS policies for secure access:
  - Users can only upload/update/delete their own avatars
  - Everyone can view all avatars

### 2. Verify Storage Bucket
After running the migration, verify in Supabase Dashboard:
1. Go to **Storage** section
2. You should see an `avatars` bucket
3. Bucket should be marked as **Public**

## Features

### User Capabilities
- ✅ Upload profile picture (max 2MB)
- ✅ Supported formats: JPG, PNG, GIF, WebP, etc.
- ✅ Preview avatar immediately after upload
- ✅ Replace existing avatar (old one is deleted automatically)
- ✅ Avatars are publicly accessible via URL

### Security
- 🔒 Row Level Security (RLS) enforced
- 🔒 Users can only manage their own avatars
- 🔒 File size limit: 2MB
- 🔒 File type validation (images only)
- 🔒 Files stored in user-specific folders: `avatars/{user_id}/`

## How It Works

### Upload Flow
1. User clicks the upload icon on their profile picture
2. Selects an image file from their device
3. Frontend validates:
   - File is an image
   - File size is under 2MB
4. Old avatar is deleted (if exists)
5. New avatar is uploaded to `avatars/{user_id}/{timestamp}.{ext}`
6. Public URL is generated
7. Profile record is updated with new `avatar_url`

### Storage Structure
```
avatars/
  ├── {user_id_1}/
  │   └── 1234567890.jpg
  ├── {user_id_2}/
  │   └── 1234567891.png
  └── {user_id_3}/
      └── 1234567892.webp
```

## Usage in Frontend

### Profile Page
The upload button appears on the profile edit page (`/profile`):
- Small upload icon overlays the avatar (bottom-right corner)
- Click to open file picker
- Shows loading spinner during upload
- Success/error toast notifications

### Avatar Display
Avatars are displayed throughout the app:
- Profile page
- Navbar (when logged in)
- Post cards (author info)
- Comments
- User management (admin view)

## API Reference

### Upload Avatar
```typescript
// File validation
if (!file.type.startsWith('image/')) {
  // Error: not an image
}
if (file.size > 2 * 1024 * 1024) {
  // Error: file too large
}

// Upload to storage
const fileName = `${userId}/${Date.now()}.${fileExt}`;
await supabase.storage
  .from('avatars')
  .upload(fileName, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(fileName);

// Update profile
await supabase
  .from('profiles')
  .update({ avatar_url: publicUrl })
  .eq('id', userId);
```

### Delete Old Avatar
```typescript
// Extract path from URL
const oldPath = avatarUrl.split('/').pop();

// Delete from storage
await supabase.storage
  .from('avatars')
  .remove([`${userId}/${oldPath}`]);
```

## Troubleshooting

### "Permission denied" when uploading
**Solution:** Make sure the storage migration has been run and RLS policies are active.

```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

### Avatar not displaying
**Possible causes:**
1. Invalid URL stored in database
2. File was deleted from storage
3. Storage bucket is not public

**Solution:** 
- Check the `avatar_url` field in profiles table
- Verify file exists in Storage > avatars bucket
- Ensure bucket is marked as "Public"

### Upload fails silently
**Solution:** Check browser console for errors. Common issues:
- Network connectivity
- File size too large
- Invalid file type
- Supabase storage quota exceeded

### Old avatars not being deleted
**Solution:** This is normal if the URL structure changed. Old files can be manually cleaned up:
1. Go to Storage > avatars in Supabase Dashboard
2. Navigate to user folders
3. Delete old/unused files

## Best Practices

### For Users
- Use square images for best results (circular crop applied)
- Recommended size: 256x256 or larger
- Keep file size under 500KB for faster loading
- Use clear, recognizable photos

### For Developers
- Consider adding image compression before upload
- Implement a "Remove Avatar" button if needed
- Add loading states during upload
- Cache avatar URLs to reduce storage reads
- Consider CDN for better performance

## Future Enhancements

Potential improvements:
- [ ] Client-side image resizing/cropping
- [ ] Image compression before upload
- [ ] Remove avatar option (revert to default)
- [ ] Avatar moderation for inappropriate content
- [ ] Multiple profile pictures / gallery
- [ ] Avatar history / previous versions

## Migration Order Reminder

Run migrations in this order:
1. Base schema (20251005...)
2. Update default role (20251006...)
3. Admin delete profiles (20251008...)
4. Authors delete posts (20251008...)
5. Increment post views (20260203000000...)
6. **Avatar storage (20260203200000...)** ← New!
