# Dante Logger

A Divine Comedy-inspired logging system that transforms mundane logging into a rich, philosophical experience.

![Dante Logger Banner](https://via.placeholder.com/1200x300/D4D1BE/333333?text=Dante+Logger)

## Overview

Dante Logger categorizes your application's logs according to Dante Alighieri's Divine Comedy:

- **Inferno (Errors)**: The 9 circles of development hell
- **Purgatorio (Warnings)**: The 7 terraces of purification
- **Paradiso (Success)**: The 9 celestial spheres + Empyrean

Each log is adorned with carefully chosen emoji combinations that visually represent the nature of the message, creating a subtle infusion of graphic design into the otherwise mundane task of reading logs.

## Installation

```bash
npm install dante-logger
# or
yarn add dante-logger
```

## Basic Usage

```typescript
import { DanteLogger } from 'dante-logger';

// Log errors (Inferno)
DanteLogger.error.validation('Invalid input format');
// 👑🔥 [Dante:Inferno:1:Limbo] Kneel Before Zod! Invalid input format

DanteLogger.error.system('Critical system failure');
// 👑❄️ [Dante:Inferno:9:Treachery] Critical system failure

// Log warnings (Purgatorio)
DanteLogger.warn.performance('Operation taking longer than expected');
// ⚠️👁️ [Dante:Purgatorio:2:Envy] Operation taking longer than expected

DanteLogger.warn.deprecated('This method will be removed in v3.0');
// ⚠️🪨 [Dante:Purgatorio:1:Pride] This method will be removed in v3.0

// Log successes (Paradiso)
DanteLogger.success.basic('Operation completed successfully');
// 😇🌙 [Dante:Paradiso:1:Moon] Operation completed successfully

DanteLogger.success.perfection('All systems functioning optimally');
// 😇🌈 [Dante:Paradiso:10:Empyrean] All systems functioning optimally
```

## Configuration

Dante Logger can be configured for different environments and platforms:

```typescript
// Configure for browser environment
DanteLogger.config.forPlatform('browser');

// Configure for Node.js environment
DanteLogger.config.forPlatform('node');

// Configure for production environment
DanteLogger.config.forEnvironment('production');

// Custom configuration
DanteLogger.config.set({
  formatting: {
    includeTimestamp: true,
    includeEmoji: true,
    colorize: true
  },
  minimumLevels: {
    inferno: 1,   // Log all errors
    purgatorio: 3, // Only log more severe warnings
    paradiso: 4    // Only log significant successes
  }
});
```

## Philosophical Framework

Dante Logger is built on a rich philosophical framework that combines:

- **Dante Alighieri's Divine Comedy**: Provides the structural metaphor for categorizing logs
- **Hermann Hesse's Precision**: Each log category has a specific, well-defined purpose
- **J.D. Salinger's Authenticity**: The emoji combinations make logs relatable and inject personality
- **Jacques Derrida's Deconstruction**: Breaking down traditional logging into a more meaningful system

## Features

- **Universal**: Works in browsers, Node.js, and any JavaScript runtime
- **Configurable**: Adapts to different environments and use cases
- **Extensible**: Allows custom realms, categories, and formatters
- **Philosophical**: Maintains a rich metaphorical framework
- **Visual**: Provides rich, emoji-based visual feedback

## Advanced Usage

### Direct Circle/Terrace/Sphere Access

```typescript
// Access specific circles of Inferno
DanteLogger.error.circle(9, 'Critical system failure detected');

// Access specific terraces of Purgatorio
DanteLogger.warn.terrace(4, 'Operation taking longer than expected');

// Access specific spheres of Paradiso
DanteLogger.success.sphere(8, 'Version 2.0 released successfully');
```

### With Additional Data

```typescript
DanteLogger.error.validation('Invalid user input', { 
  userId: 123, 
  input: { email: 'invalid-email' } 
});

DanteLogger.success.core('Database query successful', {
  query: 'SELECT * FROM users',
  duration: '42ms',
  rowCount: 15
});
```

## Framework Integrations

### Express Middleware

```typescript
import express from 'express';
import { DanteExpressLogger } from 'dante-logger/express';

const app = express();

// Log all requests and responses
app.use(DanteExpressLogger());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

### React Hooks

```typescript
import React from 'react';
import { useDanteLogger } from 'dante-logger/react';

function MyComponent() {
  const logger = useDanteLogger();
  
  const handleClick = () => {
    logger.success.ux('Button clicked');
    // Component logic...
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

## License

MIT © P. Brady Georgen
