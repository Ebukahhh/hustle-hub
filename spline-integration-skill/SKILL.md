---
name: Spline Integration Skill
description: Helps developers embed and interact with 3D scenes created in Spline inside React applications and vanilla HTML websites.
---

# Spline Integration Skill

This skill provides the knowledge and reusable code snippets needed to embed interactive 3D scenes exported from [Spline](https://spline.design) into web applications.

## When to use this skill
- When a user wants to add a 3D model or scene to their website.
- When integrating Spline scenes in a **React** or **Next.js** environment.
- When integrating Spline scenes in a **Vanilla HTML/JS** environment.
- When needing to interact with 3D objects (e.g., triggering events on click/hover).
- When debugging Spline performance issues or common rendering problems.

## Basic Workflow
1. The designer exports the Spline scene and provides a URL (e.g., `https://prod.spline.design/.../scene.splinecode`).
2. Depending on the environment, choose the appropriate integration path:
   - **React/Next.js**: See [REACT_INTEGRATION.md](./REACT_INTEGRATION.md) and reference `react-spline-wrapper.tsx`.
   - **Vanilla JS/HTML**: See [VANILLA_INTEGRATION.md](./VANILLA_INTEGRATION.md) and reference `vanilla-embed.html`.
3. If interactive events are needed, reference `interactive-scene.tsx`.
4. Review [PERFORMANCE.md](./PERFORMANCE.md) to ensure the 3D scene doesn't degrade the website's performance.
