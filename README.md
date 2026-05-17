# React & Git Mastery - 10-Day Challenge

An installable, offline-capable course for learning Git, GitHub, JavaScript foundations, modern React, routing, styling, state management, APIs, testing, and deployment.

The course keeps the original 10-day structure and day-wise lesson order intact while expanding the learning path from near-beginner explanations to mastery-level practice inside each day. It includes explanations, examples, exercises, revealable solutions, notes, favorites, progress tracking, and an in-browser JavaScript/React playground.

## Purpose

This project is designed as a self-contained learning book for students who want to move from "I can follow a tutorial" to "I can build, debug, test, and publish a React application with confidence."

It focuses on:

- Git and GitHub workflow fundamentals
- JavaScript patterns used constantly in React
- React components, props, state, events, hooks, and custom hooks
- Routing, forms, styling, animation, state management, and API data
- Testing, deployment, and production habits
- Gradual learning: beginner mental models first, then professional tradeoffs, then mastery drills

## Files

- `index.html` - the GitHub Pages entry point and enhanced course app
- `react-git-10day-tutorial.html` - preserved original course filename for direct access/backward compatibility
- `manifest.webmanifest` - PWA install metadata
- `service-worker.js` - offline cache and navigation fallback
- `icons/` - PWA install icons
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow

## Offline PWA

When opened from GitHub Pages, the app registers a service worker and caches the course shell for offline use. After the first successful load, learners can reopen the course without a network connection.

The service worker also tries to cache the external React playground runtime from `unpkg.com` during installation or first use. The course content itself is offline-ready; the playground is offline-ready after those optional runtime files have been fetched and cached at least once.

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow that publishes the static site on every push to `main`.

Expected published URL:

```text
https://naveedeme.github.io/react-tutorial/
```

In the GitHub repository settings, enable Pages with **GitHub Actions** as the source. After that, every push to `main` will deploy automatically.

## Local Preview

Because this is a static app, you can open `index.html` directly in a browser. For a more realistic service-worker test, serve it from a local web server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Service workers require a secure context. `localhost` is treated as secure for local testing, and GitHub Pages uses HTTPS in production.
