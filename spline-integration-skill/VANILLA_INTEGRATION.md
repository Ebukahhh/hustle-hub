# Vanilla HTML/JS Integration

If you aren't using a framework like React, you can embed Spline scenes using plain HTML and JavaScript in two different ways: via an `<iframe>` (simplest) or via the `@splinetool/viewer` standard web component (better for interaction).

## Method 1: The `<iframe>` approach

This is the easiest way to embed a scene but offers zero programming interaction from the parent website.

```html
<iframe 
  src="https://my.spline.design/YOUR_SCENE_ID/" 
  frameborder="0" 
  width="100%" 
  height="100%">
</iframe>
```

## Method 2: The Web Component (Viewer) approach

This method uses a standard `<spline-viewer>` custom element. It allows you to style the container more easily and optionally hook into JavaScript events.

### Step 1: Import the viewer script
Include the module script in your `<head>` or at the end of your `<body>`.

```html
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.58/build/spline-viewer.js"></script>
```

### Step 2: Use the `<spline-viewer>` tag

```html
<spline-viewer url="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"></spline-viewer>
```

### Full Example Layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spline Vanilla Embed</title>
  <script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.58/build/spline-viewer.js"></script>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
    .scene-container { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div class="scene-container">
    <spline-viewer url="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"></spline-viewer>
  </div>
</body>
</html>
```
