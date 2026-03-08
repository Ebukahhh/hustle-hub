# Performance Optimization for Spline

3D scenes can be resource-intensive. If not optimized, they can cause laptops to overheat, drain mobile batteries, and lower the framerate (FPS) of your website, creating a poor user experience.

## Best Practices

### 1. Polygon / Face Count
- **Rule of Thumb**: Keep the face count below 50,000 for web delivery, and under 20,000 for optimal mobile experience.
- Remove unseen geometry (backfaces, hidden objects).
- Avoid overly detailed bevels or subdivision surfaces.

### 2. Geometry & Instancing
- Reuse objects using Cloners or Instances inside Spline when duplicating identical elements.
- Merge static objects if they share the same material and don't require individual animations.

### 3. Lighting & Shadows
- **Bake Shadows**: Instead of real-time lighting, bake lighting and ambient occlusion into your textures if the lights do not move dynamically.
- **Directional Lights**: Limit the number of light sources. 1-2 lights are usually plenty. Soft shadows are extremely expensive in real-time.

### 4. Textures & Materials
- Compress images before importing them into Spline.
- Avoid using massive textures (e.g., 4K). 1024x1024 or 2048x2048 is more than enough for web.
- Try to use color materials or procedural gradients instead of large image textures.
- Avoid heavy Glass (Refraction) materials if there are many objects on the screen.

### 5. Physics
- Try to minimize the use of physics unless absolutely necessary, as it heavily utilizes the main thread.
- If physics are necessary, optimize the colliders (use simple boxes or capsules instead of actual mesh colliders).

### 6. Web Context & Implementation
- **Lazy Loading**: Only load the Spline scene when it enters the viewport using `IntersectionObserver`, or use React's `Suspense`.
- **DPR (Device Pixel Ratio)**: Spline often renders at the native pixel ratio naturally. On high-DPI screens (Retina, mobile phones), drawing a lot of pixels degrades performance. In `@splinetool/react-spline`, consider scaling the container or controlling the resolution.
