# Dashboard Components

This directory contains all the components for the main dashboard interface of the InnDesign AI application.

## Components Overview

### 🖥️ **Main Layout Components**

#### `Sidebar` (`sidebar.tsx`)
- **Purpose**: Fixed left navigation sidebar with dark theme
- **Features**:
  - Navigation menu (Dashboard, History, Saved Projects, Settings)
  - InnDesign AI logo and branding
  - User profile section with credits counter
  - Integrated UserMenu component
  - Hidden on mobile (lg:flex)
- **Design**: Dark slate-900 background with highlighted active states

#### `MobileHeader` (`mobile-header.tsx`)
- **Purpose**: Mobile-responsive header with hamburger menu
- **Features**:
  - Slide-out mobile navigation menu
  - Logo and branding
  - UserMenu integration
  - Animated backdrop overlay
  - Only visible on mobile (lg:hidden)
- **Design**: Smooth slide animations with Framer Motion

### 🎨 **Content Components**

#### `DesignStudio` (`design-studio.tsx`)
- **Purpose**: Main design workspace and AI generation interface
- **Features**:
  - Style tabs (Style A, B, C) with active selection
  - Main design preview area with placeholder
  - Grid of 6 thumbnail placeholders
  - Project details form with:
    - Prompt textarea
    - Room type dropdown (Living Room, Bedroom, etc.)
    - Room size input
    - Style preference dropdown (Modern, Traditional, etc.)
    - Budget range dropdown
    - Color palette selector with 3 preset options
    - File upload area with drag & drop
  - Action buttons: Generate Design, Regenerate, Refine Design
- **Design**: Clean card layout with form inputs and visual elements

#### `ROICalculator` (`roi-calculator.tsx`)
- **Purpose**: Investment return calculator widget
- **Features**:
  - Investment amount display ($12,500)
  - Property value increase (+$18,750)
  - Expected ROI percentage (150%)
  - Detailed breakdown with net profit calculation
  - Formatted currency display
- **Design**: Compact card with highlighted metrics and breakdown section

#### `SuggestedItems` (`suggested-items.tsx`)
- **Purpose**: Product recommendations and project actions
- **Features**:
  - List of suggested items with:
    - Item images (placeholders)
    - Names and prices
    - Category badges
    - Stock status indicators
  - Total estimated cost calculation
  - Action buttons: Save Project, Download PDF, Share Design
  - Quick stats section
- **Design**: Item cards with hover effects and pricing information

## 📱 Responsive Design

### Desktop (lg+)
- **Layout**: Three-column grid layout
- **Sidebar**: Fixed left navigation (288px wide)
- **Main Content**: Grid with Design Studio (6 cols) + ROI Calculator (3 cols) + Suggested Items (3 cols)

### Mobile & Tablet (< lg)
- **Layout**: Single column stack
- **Navigation**: Hamburger menu with slide-out sidebar
- **Main Content**: Design Studio full width, followed by side panels stacked vertically

## 🎨 Design System

### Color Palette
- **Primary**: Blue-600 for CTAs and highlights
- **Background**: Slate-50 (light) / Slate-950 (dark)
- **Sidebar**: Slate-900 (dark theme)
- **Cards**: White (light) / Slate-900 (dark)
- **Text**: Slate color scale for hierarchy

### Typography
- **Headers**: Font-bold with proper sizing (text-2xl, text-lg)
- **Body**: Font-medium and font-normal for content
- **Captions**: Text-sm and text-xs for metadata

### Spacing & Layout
- **Grid**: CSS Grid with responsive columns
- **Gaps**: Consistent 6-unit spacing (gap-6)
- **Padding**: Card padding (p-4, p-6) and form spacing

## 🔧 Technical Implementation

### State Management
- **Authentication**: Preserved existing `useRequireAuth` hook
- **Navigation**: `usePathname` for active states
- **Local State**: Component-level useState for UI interactions

### Animation
- **Library**: Framer Motion for smooth transitions
- **Patterns**:
  - Staggered children animations
  - Slide transitions for mobile menu
  - Hover and tap feedback
  - Page load animations with proper delays

### Accessibility
- **Semantic HTML**: Proper button, nav, and form elements
- **ARIA**: Labels and descriptions where needed
- **Focus**: Keyboard navigation support
- **Screen Readers**: Proper alt text and descriptions

## 🚀 Usage

```tsx
import {
  Sidebar,
  MobileHeader,
  DesignStudio,
  ROICalculator,
  SuggestedItems
} from '@/components/dashboard'

// Main dashboard page implementation
export default function DashboardPage() {
  const { user, loading } = useRequireAuth()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MobileHeader />
      <Sidebar />
      <div className="lg:pl-72">
        <main className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <DesignStudio />
            </div>
            <div className="lg:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ROICalculator />
              <SuggestedItems />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
```

## 🔗 Dependencies

- **UI Components**: ShadCN UI (Button, Card, Input, Select, Textarea, Tabs, Badge, Avatar)
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Styling**: TailwindCSS
- **Navigation**: Next.js Link and usePathname
- **Authentication**: Existing auth context and UserMenu component