# Logging System Documentation

This document describes the unified logging system used in the AlexAI application. The system combines four philosophical approaches to logging, providing a comprehensive and flexible logging solution.

## Philosophical Approaches

The logging system is built on four philosophical approaches:

1. **Dante Alighieri (Structure)**: Hierarchical organization of log types, inspired by the Divine Comedy's structure.
2. **Hermann Hesse (Precision)**: Technical precision and intellectual clarity in logging.
3. **J.D. Salinger (Authenticity)**: Human-readable, authentic representation of log messages.
4. **Jacques Derrida (Deconstruction)**: Breaking down traditional logging categories.

## PhilosophicalLogger

The `PhilosophicalLogger` is the single source of truth for all logging in the application. It provides a consistent API that covers all use cases and integrates with the existing logging systems.

### Installation

The `PhilosophicalLogger` is already included in the application and can be imported from `@/utils/PhilosophicalLogger`.

```typescript
import { PhilosophicalLogger } from '@/utils/PhilosophicalLogger';
```

For React components, you can use the `useLogger` hook:

```typescript
import { useLogger } from '@/contexts/LoggerContext';

function MyComponent() {
  const logger = useLogger();
  
  // Use the logger
  logger.system.info('Component rendered');
}
```

### API

The `PhilosophicalLogger` provides the following categories of logging:

#### Error Logging (Dante-inspired)

```typescript
// Log validation errors
PhilosophicalLogger.error.validation('Invalid input format', { input });

// Log data flow errors
PhilosophicalLogger.error.dataFlow('Failed to fetch data', { error });

// Log runtime errors
PhilosophicalLogger.error.runtime('Unexpected error occurred', { error });

// Log system errors
PhilosophicalLogger.error.system('Critical system failure', { error });
```

#### Process Logging (Hesse-inspired)

```typescript
// Log process start
PhilosophicalLogger.process.start('Starting data processing');

// Log process progress
PhilosophicalLogger.process.progress('Processing item 5 of 10');

// Log process completion
PhilosophicalLogger.process.complete('Data processing completed');

// Log process failure
PhilosophicalLogger.process.fail('Data processing failed', error);
```

#### User Experience Logging (Salinger-inspired)

```typescript
// Log user interactions
PhilosophicalLogger.ux.interaction('User clicked the submit button');

// Log user feedback
PhilosophicalLogger.ux.feedback('User reported a positive experience');
```

#### System Logging (Derrida-inspired)

```typescript
// Log system information
PhilosophicalLogger.system.info('Application started', { version: '1.0.0' });

// Log debug information
PhilosophicalLogger.system.debug('Detailed debug information', { data });
```

#### AI Logging

```typescript
// Log AI process start
PhilosophicalLogger.ai.start('Starting AI analysis');

// Log AI information
PhilosophicalLogger.ai.info('AI processing data');

// Log AI success
PhilosophicalLogger.ai.success('AI analysis completed successfully');

// Log AI warnings
PhilosophicalLogger.ai.warning('AI encountered a non-critical issue');

// Log AI errors
PhilosophicalLogger.ai.error('AI analysis failed');
```

#### OpenAI Logging

```typescript
// Log OpenAI requests
PhilosophicalLogger.openai.request('Sending request to OpenAI');

// Log OpenAI responses
PhilosophicalLogger.openai.response('Received response from OpenAI');

// Log OpenAI errors
PhilosophicalLogger.openai.error('OpenAI request failed');
```

### React Integration

The logging system includes React integration through the `LoggerContext` and related hooks.

#### LoggerProvider

The `LoggerProvider` component provides the `PhilosophicalLogger` to all child components through React's context API.

```tsx
import { LoggerProvider } from '@/contexts/LoggerContext';

function App() {
  return (
    <LoggerProvider>
      <YourApp />
    </LoggerProvider>
  );
}
```

#### useLogger Hook

The `useLogger` hook provides access to the `PhilosophicalLogger` in any component that is a child of the `LoggerProvider`.

```tsx
import { useLogger } from '@/contexts/LoggerContext';

function MyComponent() {
  const logger = useLogger();
  
  const handleClick = () => {
    logger.ux.interaction('Button clicked');
    // Component logic...
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

#### useComponentLogger Hook

The `useComponentLogger` hook provides a specialized logger for React components that automatically logs component lifecycle events.

```tsx
import { useComponentLogger } from '@/contexts/LoggerContext';

function MyComponent() {
  const logger = useComponentLogger('MyComponent', {
    logMount: true,
    logUnmount: true,
    logRender: false,
    logProps: false,
    logErrors: true,
  });
  
  const handleClick = () => {
    logger.info('Button clicked');
    // Component logic...
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

#### withLogger Higher-Order Component

The `withLogger` HOC provides the `PhilosophicalLogger` to a component through props.

```tsx
import { withLogger } from '@/contexts/LoggerContext';

interface MyComponentProps {
  logger?: typeof PhilosophicalLogger;
  // Other props...
}

function MyComponent({ logger, ...props }: MyComponentProps) {
  const handleClick = () => {
    logger?.ux.interaction('Button clicked');
    // Component logic...
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}

export default withLogger(MyComponent);
```

## Best Practices

1. **Use the appropriate logging category**: Choose the right category based on the type of information you're logging.
2. **Include relevant data**: When logging errors or important events, include relevant data to help with debugging.
3. **Be consistent**: Use the same logging patterns throughout the application.
4. **Don't overlog**: Avoid logging too much information, especially in production.
5. **Use the React hooks**: In React components, use the provided hooks for better integration.

## Migration Guide

If you're currently using `DanteLogger` or `HesseLogger` directly, you should migrate to the `PhilosophicalLogger` for a more consistent logging experience.

### Before

```typescript
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

// Using DanteLogger
DanteLogger.error.validation('Invalid input');

// Using HesseLogger
HesseLogger.summary.start('Starting process');
```

### After

```typescript
import { PhilosophicalLogger } from '@/utils/PhilosophicalLogger';

// Using PhilosophicalLogger
PhilosophicalLogger.error.validation('Invalid input');
PhilosophicalLogger.process.start('Starting process');
```

## Conclusion

The `PhilosophicalLogger` provides a unified logging system that combines multiple philosophical approaches to logging. By using this system consistently throughout the application, you can ensure a more coherent and comprehensive logging experience.
