# FRONTEND COMPONENTS SPECIFICATION
## Missing Components Analysis & Implementation Guide

**Document Version**: 1.0
**Last Updated**: 2026-01-15
**Frontend Completion**: 65% → Target: 100%

---

## EXECUTIVE SUMMARY

### Current Status
After comprehensive frontend analysis, we've identified **critical UI gaps** that need to be addressed:

- ✅ **Completed**: 65% of UI (Dashboard, Inbox, Outbox, NewEntry, AIAssistant, Signature, Archive, Multimedia)
- ❌ **Missing**: 35% of UI (Authentication + Cloud File Commander)

### Missing Components Breakdown

| Category | Status | Components Missing | Week to Implement |
|----------|--------|-------------------|-------------------|
| **Authentication UI** | 0% | 4 components | Week 1 |
| **Cloud File Commander** | 0% | 18 components | Week 4 |
| **Total Missing** | - | **22 components** | Weeks 1 & 4 |

### Budget Impact
- **Original assumption**: Frontend 100% complete → $0 frontend work
- **Reality**: Frontend 65% complete → **+$600 frontend work needed**
  - Week 1: +$200 for auth UI
  - Week 4: +$400 for File Commander UI

---

## PART 1: AUTHENTICATION UI (Week 1)

### Overview
**Priority**: CRITICAL
**Status**: 0% Complete
**Complexity**: Medium
**Estimated Time**: 2 days
**Budget**: +$200

### Components to Create

#### 1. Login.tsx (Main Page)
**Path**: `src/pages/Login.tsx`
**Purpose**: User login page
**Status**: ❌ DOES NOT EXIST

**Features**:
- Email + Password form
- Form validation with Zod
- Error messages display
- "Remember me" checkbox
- "Forgot password?" link
- Loading state during login
- Redirect to dashboard after login
- Show login errors from API

**Props**: None (standalone page)

**State**:
```typescript
interface LoginState {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Dependencies**:
- `react-hook-form` - Form management
- `zod` - Validation schema
- `AuthContext` - Access login function
- `react-router-dom` - Navigation after login

**UI Layout**:
```
┌──────────────────────────────────────────┐
│                                          │
│        [MTTSIA Logo]                     │
│                                          │
│   Centro de Comando Ministerial          │
│                                          │
│   ┌────────────────────────────────┐    │
│   │ Email                          │    │
│   │ [___________________________]  │    │
│   │                                │    │
│   │ Contraseña                     │    │
│   │ [___________________________]  │    │
│   │                                │    │
│   │ ☐ Recordarme                   │    │
│   │                                │    │
│   │ [    Iniciar Sesión    ]       │    │
│   │                                │    │
│   │ ¿Olvidó su contraseña?         │    │
│   └────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

**Implementation**:
```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password, data.rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Logo and title */}
        <div className="text-center">
          <img src="/logo.svg" alt="MTTSIA" className="mx-auto h-16 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Centro de Comando Ministerial
          </h2>
        </div>

        {/* Error alert */}
        {error && (
          <Alert variant="destructive">{error}</Alert>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="usuario@mttsia.gob.bo"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <Checkbox id="rememberMe" {...register('rememberMe')} />
              <Label htmlFor="rememberMe" className="ml-2">Recordarme</Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {/* Open password reset modal */}}
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

#### 2. Register.tsx (Admin Invite Flow)
**Path**: `src/pages/Register.tsx`
**Purpose**: User registration (admin-only or invite-only)
**Status**: ❌ DOES NOT EXIST

**Features**:
- Invite token validation
- User registration form
- Password strength indicator
- Terms & conditions checkbox
- Form validation
- Success message
- Auto-login after registration

**Props**:
```typescript
interface RegisterProps {
  inviteToken?: string; // Optional invite token from URL
}
```

**Implementation Note**: Since this is a ministerial system, registration should be invite-only (admin creates user accounts). This page can be simplified or made admin-only in the backend.

---

#### 3. AuthContext.tsx (State Management)
**Path**: `src/contexts/AuthContext.tsx`
**Purpose**: Global authentication state
**Status**: ❌ DOES NOT EXIST

**Features**:
- Login function
- Logout function
- Token storage (localStorage with encryption)
- Token refresh logic
- Auto-logout on 401
- User state management
- Loading state

**Context Value**:
```typescript
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'GABINETE' | 'REVISOR' | 'LECTOR';
  departmentId: string;
  department: {
    id: string;
    name: string;
  };
}
```

**Implementation**:
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Fetch user profile
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      await refreshToken();
    }, 13 * 60 * 1000); // Refresh every 13 minutes (token expires in 15 minutes)

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string, rememberMe = false) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const { accessToken, refreshToken, user: userData } = await response.json();

    localStorage.setItem('accessToken', accessToken);
    if (rememberMe) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  };

  const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken');
    if (!token) return;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token })
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        localStorage.setItem('accessToken', accessToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

#### 4. AuthGuard.tsx (Protected Routes)
**Path**: `src/components/auth/AuthGuard.tsx`
**Purpose**: Protect routes requiring authentication
**Status**: ❌ DOES NOT EXIST

**Features**:
- Check if user is authenticated
- Redirect to /login if not authenticated
- Show loading spinner while checking auth
- Support role-based access (optional)

**Usage**:
```typescript
<Route path="/dashboard" element={
  <AuthGuard>
    <Dashboard />
  </AuthGuard>
} />
```

**Implementation**:
```typescript
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'GABINETE' | 'REVISOR' | 'LECTOR';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access (optional)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Acceso Denegado</h1>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

### App.tsx Integration

Update routing to use AuthGuard:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />

          <Route path="/inbox" element={
            <AuthGuard>
              <Inbox />
            </AuthGuard>
          } />

          {/* ... other protected routes */}

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## PART 2: CLOUD FILE COMMANDER UI (Week 4)

### Overview
**Priority**: CRITICAL (Core Feature)
**Status**: 0% Complete
**Complexity**: High
**Estimated Time**: 3.5 days
**Budget**: +$400

**This is the MAIN feature the client requested** - File Commander-like functionality integrated into the ministerial platform.

---

### Main Page

#### 5. CloudStorage.tsx (Main Page)
**Path**: `src/pages/CloudStorage.tsx`
**Purpose**: Main File Commander page
**Status**: ❌ DOES NOT EXIST

**Features**:
- Cloud connection cards (OneDrive, Google Drive, S3)
- File browser (unified interface)
- View mode toggle (grid/list)
- Search bar
- Filters sidebar
- Batch operations toolbar
- Storage usage meter
- Recent files widget

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────┐
│ Cloud Storage                                   [Search]│
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│ │  OneDrive   │ │ Google Drive│ │   AWS S3    │       │
│ │  ✓ Active   │ │  ✓ Active   │ │   Local     │       │
│ │  250GB/1TB  │ │  150GB/500GB│ │  100GB      │       │
│ │ [Disconnect]│ │ [Disconnect]│ │             │       │
│ └─────────────┘ └─────────────┘ └─────────────┘       │
├───────┬─────────────────────────────────────────────────┤
│Filters│ Home > Documents > Reports         [Grid][List]│
│       │                                                 │
│ Types │ [Select: 0]  [↓ Download] [Import] [Delete]    │
│☐ PDF  │                                                 │
│☐ Word │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│☐ Excel│ │[IMG] │ │[PDF] │ │[DOC] │ │[XLS] │ │[PDF] │  │
│☐ Image│ │Photo │ │Report│ │Letter│ │Budget│ │Memo  │  │
│       │ │2.5MB │ │1.2MB │ │850KB │ │3.1MB │ │640KB │  │
│ Size  │ │Jan15 │ │Jan14 │ │Jan13 │ │Jan12 │ │Jan11 │  │
│☐ <1MB │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│☐ 1-10 │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│☐10-100│ │[VID] │ │[PDF] │ │[IMG] │ │[DOC] │ │[XLS] │  │
│       │ │Meet  │ │Con...│ │Scan  │ │Memo  │ │Data  │  │
│ Date  │ │45 MB │ │980KB │ │1.8MB │ │650KB │ │2.2MB │  │
│☐ Today│ │Jan10 │ │Jan09 │ │Jan08 │ │Jan07 │ │Jan06 │  │
│☐ Week │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│       │                                                 │
│ Recent│ Page 1 of 24                           [Next>] │
│[Files]│                                                 │
└───────┴─────────────────────────────────────────────────┘
```

**Implementation** (abbreviated):
```typescript
import { useState } from 'react';
import { CloudConnectionCard } from '@/components/cloud/CloudConnectionCard';
import { FileBrowser } from '@/components/files/FileBrowser';
import { FileTypeFilter } from '@/components/files/FileTypeFilter';
import { SearchBar } from '@/components/files/FileSearchBar';
import { StorageUsageMeter } from '@/components/files/StorageUsageMeter';
import { RecentFilesWidget } from '@/components/files/RecentFilesWidget';

export default function CloudStorage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentProvider, setCurrentProvider] = useState<'onedrive' | 'gdrive' | 's3'>('s3');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cloud Storage</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Cloud Connection Cards */}
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <CloudConnectionCard provider="onedrive" />
        <CloudConnectionCard provider="gdrive" />
        <CloudConnectionCard provider="s3" />
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-white border-r p-4">
          <FileTypeFilter />
          <RecentFilesWidget />
        </aside>

        {/* File Browser */}
        <main className="flex-1 p-6">
          <FileBrowser
            provider={currentProvider}
            viewMode={viewMode}
            selectedFiles={selectedFiles}
            onSelectFiles={setSelectedFiles}
          />
        </main>
      </div>

      {/* Storage Usage (bottom) */}
      <div className="fixed bottom-0 right-0 p-4">
        <StorageUsageMeter />
      </div>
    </div>
  );
}
```

---

### Core File Browsing Components

#### 6. FileBrowser.tsx (Unified Browser)
**Path**: `src/components/files/FileBrowser.tsx`
**Purpose**: Unified file browser for S3, OneDrive, Google Drive
**Status**: ❌ DOES NOT EXIST

**Features**:
- Switch between providers
- Show files in grid or list view
- Folder navigation
- File selection (single/multiple)
- Drag-drop upload
- Context menu (right-click)
- Infinite scroll pagination

**Props**:
```typescript
interface FileBrowserProps {
  provider: 'onedrive' | 'gdrive' | 's3';
  viewMode: 'grid' | 'list';
  selectedFiles: string[];
  onSelectFiles: (fileIds: string[]) => void;
  onNavigateFolder?: (folderId: string) => void;
}
```

---

#### 7. FileGrid.tsx (Grid View)
**Path**: `src/components/files/FileGrid.tsx`
**Purpose**: Display files as thumbnail grid
**Status**: ❌ DOES NOT EXIST

**Features**:
- Thumbnail grid (4 columns desktop, 2 mobile)
- Lazy loading images
- File selection checkboxes
- Hover effects
- Context menu
- Drag-drop reordering

**Example**:
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ ☐    │ │ ☐    │ │ ☐    │ │ ☐    │
│[IMG] │ │[PDF] │ │[DOC] │ │[XLS] │
│Photo │ │Report│ │Letter│ │Budget│
│2.5MB │ │1.2MB │ │850KB │ │3.1MB │
│Jan15 │ │Jan14 │ │Jan13 │ │Jan12 │
└──────┘ └──────┘ └──────┘ └──────┘
```

**Implementation** (abbreviated):
```typescript
import { FileCard } from './FileCard';
import { useVirtualizer } from '@tanstack/react-virtual';

interface FileGridProps {
  files: File[];
  selectedFiles: string[];
  onSelectFile: (fileId: string) => void;
  onOpenFile: (file: File) => void;
}

export function FileGrid({ files, selectedFiles, onSelectFile, onOpenFile }: FileGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {files.map(file => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={selectedFiles.includes(file.id)}
          onSelect={() => onSelectFile(file.id)}
          onOpen={() => onOpenFile(file)}
        />
      ))}
    </div>
  );
}
```

---

#### 8. FileList.tsx (List/Table View)
**Path**: `src/components/files/FileList.tsx`
**Purpose**: Display files as sortable table
**Status**: ❌ DOES NOT EXIST

**Features**:
- Table with columns: Checkbox, Icon, Name, Size, Date, Actions
- Sortable columns
- Row selection
- Virtual scrolling (for large lists)
- Context menu

**Example**:
```
┌──┬────┬─────────────┬─────────┬──────────┬────────┐
│☐ │Icon│ Name        │ Size    │ Modified │ Actions│
├──┼────┼─────────────┼─────────┼──────────┼────────┤
│☐ │📄 │ Report.pdf  │ 1.2 MB  │ Jan 14   │ ⋮      │
│☐ │📝 │ Letter.docx │ 850 KB  │ Jan 13   │ ⋮      │
│☐ │📊 │ Budget.xlsx │ 3.1 MB  │ Jan 12   │ ⋮      │
└──┴────┴─────────────┴─────────┴──────────┴────────┘
```

---

#### 9. FileCard.tsx (Individual File Card)
**Path**: `src/components/files/FileCard.tsx`
**Purpose**: Single file card component (for grid view)
**Status**: ❌ DOES NOT EXIST

**Features**:
- File thumbnail or icon
- File name (truncated)
- File size
- Modified date
- Selection checkbox
- Hover actions
- Double-click to open

---

#### 10. FilePreview.tsx (Preview Modal)
**Path**: `src/components/files/FilePreview.tsx`
**Purpose**: Preview images and PDFs in modal
**Status**: ❌ DOES NOT EXIST

**Features**:
- Display images (jpg, png, gif)
- Display PDFs (using react-pdf)
- Next/Previous navigation
- Download button
- Close button
- Zoom in/out (for images)

**Dependencies**:
- `react-pdf` - PDF rendering
- `react-image-lightbox` or custom lightbox

---

### Navigation Components

#### 11. FolderBreadcrumb.tsx
**Path**: `src/components/files/FolderBreadcrumb.tsx`
**Purpose**: Show current folder path with clickable navigation
**Status**: ❌ DOES NOT EXIST

**Example**:
```
Home > Documents > Reports > 2024
       ^          ^         ^
     (clickable)
```

---

### Filter & Search Components

#### 12. FileTypeFilter.tsx
**Path**: `src/components/files/FileTypeFilter.tsx`
**Purpose**: Sidebar filter for file types
**Status**: ❌ DOES NOT EXIST

**Features**:
- File type checkboxes (PDF, Word, Excel, Images, Videos, Other)
- Size filters (<1MB, 1-10MB, 10-100MB, >100MB)
- Date filters (Today, This week, This month, Custom range)
- "Clear all" button

---

#### 13. FileSearchBar.tsx
**Path**: `src/components/files/FileSearchBar.tsx`
**Purpose**: Search files by name or content
**Status**: ❌ DOES NOT EXIST

**Features**:
- Debounced search input
- Search icon
- Clear button
- Filter dropdown (search by name, content, tags)

---

### Upload Components

#### 14. FileUploadZone.tsx
**Path**: `src/components/files/FileUploadZone.tsx`
**Purpose**: Drag-drop file upload
**Status**: ❌ DOES NOT EXIST

**Features**:
- Drag-drop area (entire page or specific zone)
- Click to browse files
- Multiple file upload
- File type restrictions
- Size limit validation
- Show upload queue

**Dependencies**:
- `react-dropzone` - Drag-drop functionality

---

#### 15. UploadProgress.tsx
**Path**: `src/components/files/UploadProgress.tsx`
**Purpose**: Show upload progress for files
**Status**: ❌ DOES NOT EXIST

**Features**:
- Progress bar per file
- Total progress
- Cancel upload button
- Retry failed uploads
- Success/error indicators

---

### Cloud Import Components

#### 16. ImportWizard.tsx
**Path**: `src/components/files/ImportWizard.tsx`
**Purpose**: Modal to import files from OneDrive/Google Drive
**Status**: ❌ DOES NOT EXIST

**Features**:
- Step 1: Select cloud provider
- Step 2: Browse and select files
- Step 3: Preview selected files
- Step 4: Import to document
- Progress indicator
- Cancel button

**Steps**:
```
Step 1: Select Provider
┌────────────────────────────────────┐
│ Import from Cloud Storage          │
│                                    │
│ Select a provider:                 │
│ ○ OneDrive                         │
│ ○ Google Drive                     │
│                                    │
│          [Cancel]  [Next>]         │
└────────────────────────────────────┘

Step 2: Browse Files
┌────────────────────────────────────┐
│ OneDrive > Documents               │
│                                    │
│ ☐ Report.pdf        1.2 MB         │
│ ☐ Budget.xlsx       3.1 MB         │
│ ☐ Meeting.mp4       45 MB          │
│                                    │
│ Selected: 0 files                  │
│          [<Back]  [Next>]          │
└────────────────────────────────────┘

Step 3: Confirm Import
┌────────────────────────────────────┐
│ Import Summary                     │
│                                    │
│ Files to import: 2                 │
│ Total size: 4.3 MB                 │
│                                    │
│ • Report.pdf                       │
│ • Budget.xlsx                      │
│                                    │
│          [<Back]  [Import]         │
└────────────────────────────────────┘
```

---

### Cloud Connection Components

#### 17. CloudConnectionCard.tsx
**Path**: `src/components/cloud/CloudConnectionCard.tsx`
**Purpose**: Show connection status for cloud providers
**Status**: ❌ DOES NOT EXIST

**Features**:
- Provider logo and name
- Connection status (Connected, Disconnected, Error)
- Storage usage meter
- Last synced time
- Connect/Disconnect button
- Settings dropdown

**Example**:
```
┌─────────────────────────┐
│   [OneDrive Logo]       │
│                         │
│   OneDrive              │
│   ✓ Connected           │
│                         │
│   Storage: 250GB/1TB    │
│   [████████░░] 25%      │
│                         │
│   Last sync: 2 min ago  │
│                         │
│   [Disconnect]  [⚙️]    │
└─────────────────────────┘
```

---

#### 18. CloudConnectButton.tsx
**Path**: `src/components/cloud/CloudConnectButton.tsx`
**Purpose**: Button to initiate OAuth connection
**Status**: ❌ DOES NOT EXIST

**Features**:
- Open OAuth popup window
- Handle OAuth callback
- Show connection progress
- Handle errors
- Refresh connections list after success

---

### Provider-Specific Browsers (Optional)

#### 19. OneDriveBrowser.tsx
**Path**: `src/components/cloud/OneDriveBrowser.tsx`
**Purpose**: OneDrive-specific file browser
**Status**: ❌ DOES NOT EXIST (Optional)

**Note**: Can be abstracted into FileBrowser.tsx with provider prop. Only create if provider-specific features are needed.

---

#### 20. GoogleDriveBrowser.tsx
**Path**: `src/components/cloud/GoogleDriveBrowser.tsx`
**Purpose**: Google Drive-specific file browser
**Status**: ❌ DOES NOT EXIST (Optional)

**Note**: Can be abstracted into FileBrowser.tsx with provider prop.

---

### Operations & Widgets

#### 21. FileOperations.tsx
**Path**: `src/components/files/FileOperations.tsx`
**Purpose**: Batch operations toolbar
**Status**: ❌ DOES NOT EXIST

**Features**:
- Download selected files (as ZIP)
- Import selected files to document
- Delete selected files
- Move/Copy files
- Select all / Clear selection
- Show selected count

**Example**:
```
┌─────────────────────────────────────────────────┐
│ Selected: 3 files                               │
│ [↓ Download] [Import] [Delete] [Clear]         │
└─────────────────────────────────────────────────┘
```

---

#### 22. StorageUsageMeter.tsx
**Path**: `src/components/files/StorageUsageMeter.tsx`
**Purpose**: Visual storage usage indicator
**Status**: ❌ DOES NOT EXIST

**Features**:
- Progress bar showing used/total storage
- Per-provider breakdown
- Color-coded (green <50%, yellow 50-80%, red >80%)
- Tooltip with detailed info

**Example**:
```
┌─────────────────────────┐
│ Storage Usage           │
│ [████████░░] 75%        │
│ 750 GB / 1 TB           │
│                         │
│ • OneDrive: 250 GB      │
│ • Google Drive: 150 GB  │
│ • AWS S3: 350 GB        │
└─────────────────────────┘
```

---

#### 23. RecentFilesWidget.tsx
**Path**: `src/components/files/RecentFilesWidget.tsx`
**Purpose**: Quick access to recent files
**Status**: ❌ DOES NOT EXIST

**Features**:
- Show last 10 accessed files
- File icon, name, date
- Click to open preview
- Quick download button

---

## IMPLEMENTATION PRIORITIES

### Week 1 (Authentication) - 2 days
**Priority Order**:
1. AuthContext.tsx (Core - required by all)
2. Login.tsx (Main entry point)
3. AuthGuard.tsx (Route protection)
4. Register.tsx (Lower priority - admin creates users)

### Week 4 (File Commander) - 3.5 days
**Priority Order** (implement in this order):

**Day 1**: Core infrastructure
1. CloudStorage.tsx (Main page shell)
2. CloudConnectionCard.tsx (Show connection status)
3. CloudConnectButton.tsx (OAuth flow)

**Day 2**: File browsing
4. FileBrowser.tsx (Unified browser)
5. FileCard.tsx (Individual file display)
6. FileGrid.tsx (Grid view)
7. FileList.tsx (Table view)

**Day 3**: Navigation & operations
8. FolderBreadcrumb.tsx (Folder navigation)
9. FileOperations.tsx (Batch operations)
10. FileSearchBar.tsx (Search)
11. FileTypeFilter.tsx (Filters)

**Day 4**: Upload & import
12. FileUploadZone.tsx (Drag-drop upload)
13. UploadProgress.tsx (Progress tracking)
14. ImportWizard.tsx (Cloud import)
15. FilePreview.tsx (Preview modal)

**Day 5**: Polish & widgets
16. StorageUsageMeter.tsx (Storage visualization)
17. RecentFilesWidget.tsx (Recent files)
18. Mobile responsive polish
19. Error states & loading skeletons
20. Testing & bug fixes

---

## TESTING CHECKLIST

### Authentication Testing
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Token refresh before expiration
- [ ] Auto-logout on 401 response
- [ ] Remember me functionality
- [ ] Protected routes redirect to login
- [ ] User info displays in sidebar after login

### File Commander Testing
- [ ] Connect OneDrive account (OAuth)
- [ ] Connect Google Drive account (OAuth)
- [ ] Browse OneDrive files
- [ ] Browse Google Drive files
- [ ] Browse S3 files
- [ ] Switch between providers
- [ ] Switch between grid/list view
- [ ] Folder navigation (breadcrumbs)
- [ ] File search by name
- [ ] Filter by file type
- [ ] Filter by size
- [ ] Filter by date
- [ ] Select single file
- [ ] Select multiple files
- [ ] Select all files
- [ ] Upload file via drag-drop
- [ ] Upload file via click
- [ ] Upload progress tracking
- [ ] Cancel upload
- [ ] Import file from OneDrive
- [ ] Import file from Google Drive
- [ ] Download single file
- [ ] Download multiple files (ZIP)
- [ ] Delete file
- [ ] File preview (image)
- [ ] File preview (PDF)
- [ ] Storage usage display
- [ ] Recent files widget
- [ ] Mobile responsive (iPhone)
- [ ] Mobile responsive (Android)

---

## DEPENDENCIES TO INSTALL

```bash
npm install --save \
  react-hook-form \
  @hookform/resolvers \
  zod \
  react-dropzone \
  react-pdf \
  @tanstack/react-virtual \
  @tanstack/react-query
```

---

## SUCCESS METRICS

### Completion Criteria
- ✅ All 22 components implemented
- ✅ All features working as specified
- ✅ No critical bugs
- ✅ Mobile responsive (iPhone + Android tested)
- ✅ Performance acceptable (load time <3s, smooth scrolling)
- ✅ UI matches design system (shadcn/ui + Tailwind)
- ✅ All tests passing

### Definition of Done for Each Component
- ✅ Component file created
- ✅ TypeScript types defined
- ✅ Props interface documented
- ✅ Features implemented
- ✅ Error handling added
- ✅ Loading states added
- ✅ Empty states added
- ✅ Mobile responsive
- ✅ Tested in browser

---

**Document Version**: 1.0
**Last Updated**: 2026-01-15
**Total Components**: 22 (4 auth + 18 file commander)
**Estimated Total Time**: 5.5 days (2 days auth + 3.5 days file commander)
**Budget Impact**: +$600 (+$200 Week 1 + $400 Week 4)
