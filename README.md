# Naoned

A personal dashboard app for Nantes, built with React Native and Expo.

The dashboard is made up of **bricks** — modular tiles you pick, reorder, and remove. Each brick is a self-contained widget for a local service or information source.

## Current bricks

> Some of these bricks may be placeholders for ui and architecture development.

- **Time** — Time for Nantes
- **TAN wait time** — upcoming departures from nearby stops (Naolib)

## Stack

- [Expo](https://expo.dev) + [Expo Router](https://expo.github.io/router) (file-based navigation)
- React Native 0.81 / React 19
- TypeScript
- `react-native-draggable-flatlist` for drag-to-reorder
- `@react-native-async-storage/async-storage` for persistence

## Getting started

```bash
npm install
npm start
```

Then open on Android, iOS, or web from the Expo dev tools.

## Project structure

```
app/
  index.tsx          # Dashboard screen
  catalogue.tsx      # Brick picker
  bricks/            # Brick detail screens (weather, naolib, agenda)
  _layout.tsx        # Root layout

src/
  bricks/            # Brick definitions, registry, and components
  context/           # DashboardContext
  store/             # Persistence layer
  components/        # Shared UI components
  hooks/
  theme/
```

## Contributing

Contributions are welcome. To add a new brick:

1. Add a definition to `src/bricks/registry.ts`
2. Create a detail screen under `app/bricks/`
3. Open a pull request

## License

MIT
