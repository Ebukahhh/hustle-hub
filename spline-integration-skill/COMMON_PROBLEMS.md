# Common Problems & Troubleshooting

When embedding Spline scenes, developers frequently encounter the following issues:

### 1. Scene Not Loading (Blank Screen)
**Symptom:** The website loads, but the Spline container is completely empty or just shows the fallback content.
**Causes & Fixes:**
- **Wrong URL**: Ensure you use the `.splinecode` URL (e.g., `https://prod.spline.design/.../scene.splinecode`), NOT the public viewer link (`https://my.spline.design/...`).
- **CORS/Adblockers**: Sometime ad blockers or Brave Shields block third-party `prod.spline.design` URLs.
- **Missing Height**: The parent container `div` MUST have a defined `height` and `width` (e.g., `height: 100vh`, `width: 100%`). If the parent is `0px` tall, the canvas won't display.

### 2. Canvas Blocking Page Scroll (Vanilla `spline-viewer`)
**Symptom:** Scrolling the webpage stops working when the user's cursor is over the 3D scene.
**Causes & Fixes:**
- The `spline-viewer` automatically captures scroll events if the scene itself is configured with "Pan" or "Zoom" interactions on the camera.
- **Fix**: Open the scene in the Spline Editor -> Select "Camera" or "Base Scene" -> Uncheck "Zoom" and "Pan" under limits. Re-export.
- Alternatively, apply CSS `pointer-events: none;` to the canvas container if you don't need any user interaction.

### 3. Extremely Low FPS on Mobile
**Symptom:** The site lags significantly, or the device heats up quickly when opened on a smartphone.
**Causes & Fixes:**
- **Mobile Resolution**: High-DPI screens cause rendering of 4x the pixels.
- **Heavy Shaders**: Glass, refraction, transparent materials, and real-time shadows kill mobile GPUs. 
- **Fix**: Remove heavy effects for mobile versions, or use states to load an entirely different, simpler version of the scene for mobile users.

### 4. Interactions (Clicks/Hovers) Not Registering in React
**Symptom:** You added `onMouseDown` or `onMouseHover` to the React component, but it's not firing.
**Causes & Fixes:**
- Ensure the objects in Spline are actually named correctly in your verification check (e.g., `e.target.name === 'MyCube'`).
- Ensure the objects in the Spline editor are set to receive pointer events (and are not occluded by invisible collision planes).
- Test with `console.log(e.target.name)` to see what is *actually* being clicked.

### 5. Next.js "window is not defined" Error
**Symptom:** Next.js throws an SSR error when navigating to a page containing a Spline component.
**Causes & Fixes:**
- The `@splinetool/react-spline` library relies heavily on browser-only APIs (`window`, `document`).
- **Fix**: Include `"use client";` at the top of the Next.js component. Alternatively, dynamically import the component with SSR disabled:
  ```tsx
  import dynamic from 'next/dynamic';
  const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });
  ```
