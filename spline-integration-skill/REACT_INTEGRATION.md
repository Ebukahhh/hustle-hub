# React & Next.js Integration

Embedding a Spline scene in a React or Next.js application is best done using the official `@splinetool/react-spline` package.

## 1. Installation

Install the required package via npm, pnpm, or yarn:

```bash
npm install @splinetool/react-spline
# or
yarn add @splinetool/react-spline
# or
pnpm add @splinetool/react-spline
```

## 2. Basic Usage

Import the `Spline` component and pass the URL of your `.splinecode` export.

```tsx
import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
    </div>
  );
}
```

## 3. Usage in Next.js (App Router)

If you are using Next.js, particularly the App Router, Spline relies on browser-only APIs such as `window` and `document`. The `@splinetool/react-spline` component works fine in client components. Ensure you mark your component with `"use client";`.

```tsx
"use client";
import Spline from '@splinetool/react-spline';

export default function HeroScene() {
  return (
    <main style={{ height: '100vh', width: '100%' }}>
      <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
    </main>
  );
}
```
