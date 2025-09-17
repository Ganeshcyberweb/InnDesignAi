# Profile Setup API Endpoint

## Overview

The `/api/profile/setup` endpoint handles initial profile setup for authenticated users, including optional avatar upload functionality.

## Endpoint Details

- **URL**: `/api/profile/setup`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required

## Request Format

### FormData Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name (2-100 characters) |
| `role` | string | Yes | User role: `CLIENT`, `DESIGNER`, or `ADMIN` |
| `company` | string | Conditional | Company name (required for `DESIGNER` role) |
| `avatar` | File | No | Avatar image file (JPEG, PNG, WebP, max 5MB) |

### Example Request

```javascript
const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('role', 'CLIENT')
formData.append('company', 'Acme Corp') // Only for DESIGNER role
formData.append('avatar', avatarFile) // Optional

const response = await fetch('/api/profile/setup', {
  method: 'POST',
  body: formData,
  // Don't set Content-Type header - let browser set it with boundary
})
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "profile-uuid",
      "userId": "user-uuid",
      "name": "John Doe",
      "company": "Acme Corp",
      "role": "CLIENT",
      "avatar": "https://storage.supabase.co/avatars/user-uuid/avatar.jpg",
      "createdAt": "2023-12-01T10:00:00Z",
      "updatedAt": "2023-12-01T10:00:00Z",
      "designs": []
    }
  },
  "message": "Profile setup completed successfully"
}
```

### Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "name": "Name must be at least 2 characters",
    "company": "Company name is required for designers"
  }
}
```

#### Profile Already Completed (409)

```json
{
  "success": false,
  "error": "Profile setup has already been completed",
  "code": "PROFILE_ALREADY_COMPLETED"
}
```

#### Avatar Upload Error (400/500)

```json
{
  "success": false,
  "error": "File size must be less than 5MB",
  "code": "INVALID_AVATAR_FILE"
}
```

#### Authentication Error (401)

```json
{
  "success": false,
  "error": "Unauthorized - Please sign in",
  "code": "UNAUTHORIZED"
}
```

## Validation Rules

### Name
- Required
- Minimum 2 characters
- Maximum 100 characters
- Trimmed of whitespace

### Role
- Required
- Must be one of: `CLIENT`, `DESIGNER`, `ADMIN`

### Company
- Optional for `CLIENT` and `ADMIN` roles
- Required for `DESIGNER` role
- Maximum 200 characters
- Trimmed of whitespace

### Avatar
- Optional
- File types: JPEG, PNG, WebP
- Maximum file size: 5MB
- Uploaded to Supabase storage with unique filename

## Integration Notes

### Frontend Integration

```typescript
import { useState } from 'react'

interface ProfileSetupData {
  name: string
  role: 'CLIENT' | 'DESIGNER' | 'ADMIN'
  company?: string
  avatar?: File
}

async function setupProfile(data: ProfileSetupData) {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('role', data.role)

  if (data.company) {
    formData.append('company', data.company)
  }

  if (data.avatar) {
    formData.append('avatar', data.avatar)
  }

  const response = await fetch('/api/profile/setup', {
    method: 'POST',
    body: formData
  })

  return response.json()
}
```

### Error Handling

```typescript
try {
  const result = await setupProfile(profileData)

  if (result.success) {
    // Profile setup successful
    console.log('Profile created:', result.data.profile)
    // Redirect to dashboard or next step
  } else {
    // Handle validation or other errors
    if (result.errors) {
      // Display field-specific errors
      Object.entries(result.errors).forEach(([field, error]) => {
        console.error(`${field}: ${error}`)
      })
    } else {
      // Display general error
      console.error(result.error)
    }
  }
} catch (error) {
  console.error('Network error:', error)
}
```

## Storage Configuration

### Supabase Storage Bucket

The endpoint automatically ensures the `avatars` bucket exists with the following configuration:

- **Bucket Name**: `avatars`
- **Public Access**: Enabled
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`
- **File Size Limit**: 5MB
- **File Structure**: `{userId}/avatar_{timestamp}.{extension}`

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Security Considerations

1. **Authentication**: All requests must include valid session cookies
2. **File Validation**: Avatar files are validated for type, size, and content
3. **One-Time Setup**: Prevents multiple profile completions for the same user
4. **Input Sanitization**: All text inputs are trimmed and validated
5. **Error Handling**: Sensitive information is not leaked in error messages

## Testing

Run the test suite:

```bash
npm test app/api/profile/setup/__tests__/route.test.ts
```

The test suite covers:
- Successful profile setup with and without avatar
- Validation error handling
- File upload validation
- Authentication error handling
- Database error handling
- HTTP method restrictions

## Related Files

- **Validation Schema**: `/app/lib/validations/auth.ts`
- **Avatar Upload Utilities**: `/app/lib/storage/avatar-upload.ts`
- **Database Operations**: `/app/lib/database.ts`
- **Auth Helpers**: `/app/lib/auth/helpers.ts`
- **Existing Profile API**: `/app/api/auth/profile/route.ts`

## Usage Flow

1. User signs up and gets redirected to profile setup
2. Frontend displays form with name, role, company (conditional), and avatar upload
3. User fills form and submits
4. API validates data and uploads avatar (if provided)
5. Profile is updated in database
6. Success response returned with complete profile data
7. Frontend redirects to dashboard or next step

This endpoint is designed to work seamlessly with the existing authentication and database infrastructure while providing secure, validated profile setup functionality.