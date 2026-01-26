

# Admin Panel Authentication Implementation

## Overview

This plan adds password-protected access to the admin panel using JWT (JSON Web Token) authentication. When someone tries to access `/admin`, they'll see a login page. After entering the correct password, a JWT token is created and stored in the browser session, allowing access to all admin pages until they log out or close the browser.

## What You'll Get

- **Login Page** - A branded login form matching your site's design with password field and "Sign In" button
- **Protected Admin Routes** - All admin pages (`/admin/*`) will redirect to login if not authenticated  
- **Logout Functionality** - A logout button in the admin sidebar to end the session
- **Session Persistence** - Stay logged in while the browser tab is open (uses sessionStorage for security)

## How It Works

```text
+------------------+     +------------------+     +------------------+
|   User visits    | --> |  Check for valid | --> |  Valid token?    |
|   /admin         |     |  JWT token       |     |  Show admin      |
+------------------+     +------------------+     +------------------+
                                 |                        ^
                                 v (no token)             |
                         +------------------+             |
                         |  Show login page |             |
                         +------------------+             |
                                 |                        |
                                 v (correct password)     |
                         +------------------+             |
                         |  Generate JWT    |-------------+
                         |  Store in session|
                         +------------------+
```

## Important Security Note

Since this is a client-side only solution (no backend), the password verification happens in the browser. This provides a **basic layer of protection** suitable for:
- Preventing casual access to admin features
- Keeping the admin panel hidden from regular visitors

For stronger security in the future, you can upgrade to Lovable Cloud which provides server-side authentication with encrypted password storage.

---

## Technical Details

### New Files to Create

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Manages authentication state (login status, token) |
| `src/pages/admin/AdminLogin.tsx` | Login page component with password form |
| `src/lib/auth.ts` | JWT token generation and validation utilities |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Wrap app with AuthProvider |
| `src/components/admin/AdminLayout.tsx` | Add authentication check and logout button |

### Implementation Approach

1. **Auth Context** - Create a React context to manage:
   - `isAuthenticated` - Whether user is logged in
   - `login(password)` - Validate password and create JWT
   - `logout()` - Clear token and redirect to login

2. **JWT Token** - Generate a signed token containing:
   - Issued timestamp
   - Expiration (8 hours)
   - Role identifier

3. **Protected Route Logic** - In AdminLayout:
   - Check for valid token on mount
   - Redirect to `/admin/login` if not authenticated
   - Show admin content if authenticated

4. **Login Page** - Features:
   - Password input field
   - Error message for incorrect password
   - Loading state during validation
   - Matches existing site styling

5. **Logout** - Replace "Back to Website" with "Logout" button that:
   - Clears the session token
   - Redirects to login page

### Password Configuration

The admin password will be configurable in the Admin Settings page. Default password: `admin123` (you should change this immediately after setup).

