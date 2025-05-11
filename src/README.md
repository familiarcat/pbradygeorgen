# AlexAI Project Structure

This document outlines the organization of the AlexAI project codebase, explaining the purpose of each directory and the relationships between components.

## Core Principles

The project structure follows these core principles:

1. **Hierarchical Organization**: Related functionality is grouped together in a hierarchical structure.
2. **Separation of Concerns**: Different aspects of the application are separated into distinct directories.
3. **Dependency Direction**: Dependencies flow from higher-level components to lower-level utilities.
4. **Philosophical Alignment**: The structure reflects the philosophical approaches of Hesse, Salinger, Derrida, and Dante.

## Directory Structure

```
src/
├── core/                      # Core application functionality
│   ├── logger/                # Logging system
│   │   ├── dante/             # Dante-specific logging
│   │   ├── hesse/             # Hesse-specific logging
│   │   ├── philosophical/     # Unified philosophical logger
│   │   └── context/           # Logger context providers
│   ├── result/                # Result pattern implementation
│   ├── storage/               # Storage services
│   │   ├── local/             # Local storage implementation
│   │   ├── s3/                # S3 storage implementation
│   │   └── unified/           # Unified storage service
│   ├── types/                 # Shared type definitions
│   └── platform/              # Platform detection and environment
│
├── pdf/                       # PDF processing functionality
│   ├── extraction/            # PDF content extraction
│   ├── analysis/              # PDF content analysis
│   │   ├── openai/            # OpenAI analysis
│   │   └── color/             # Color analysis
│   ├── generation/            # PDF generation
│   └── viewer/                # PDF viewing components
│
├── ui/                        # UI components
│   ├── common/                # Common UI components
│   ├── layout/                # Layout components
│   ├── admin/                 # Admin UI components
│   ├── theme/                 # Theming components
│   │   ├── color/             # Color theming
│   │   └── font/              # Font theming
│   └── modal/                 # Modal components
│
├── features/                  # Feature-specific code
│   ├── cover-letter/          # Cover letter functionality
│   ├── resume/                # Resume functionality
│   ├── download/              # Download functionality
│   └── upload/                # Upload functionality
│
├── contexts/                  # Context providers
│   ├── admin/                 # Admin context
│   ├── theme/                 # Theme context
│   └── content/               # Content state context
│
├── hooks/                     # Custom hooks
│
├── utils/                     # Utility functions
│   ├── string/                # String utilities
│   ├── format/                # Formatting utilities
│   └── cache/                 # Caching utilities
│
└── api/                       # API routes and handlers
    ├── content/               # Content-related API
    ├── pdf/                   # PDF-related API
    └── openai/                # OpenAI-related API
```

## Key Components

### Core

The `core` directory contains fundamental utilities and services that are used throughout the application:

- **logger**: The logging system, organized by philosophical approach:
  - **dante**: Structured, hierarchical logging (Dante's Inferno)
  - **hesse**: Precise, technical logging (Hermann Hesse)
  - **philosophical**: Unified logger combining all approaches
  - **context**: React context providers for logging

- **result**: Implementation of the Result pattern for functional error handling

- **storage**: Storage services for persisting data:
  - **local**: Local storage implementation
  - **s3**: AWS S3 storage implementation
  - **unified**: Unified storage service that abstracts over different backends

- **types**: Shared type definitions used throughout the application

- **platform**: Platform detection and environment utilities

### PDF

The `pdf` directory contains all functionality related to PDF processing:

- **extraction**: Utilities for extracting content from PDFs
- **analysis**: Utilities for analyzing PDF content:
  - **openai**: OpenAI-based analysis of PDF content
  - **color**: Color theory and analysis utilities
- **generation**: Utilities for generating PDFs
- **viewer**: Components for viewing PDFs

### UI

The `ui` directory contains all UI components:

- **common**: Common UI components used throughout the application
- **layout**: Layout components for structuring the UI
- **admin**: Admin-specific UI components
- **theme**: Theming components:
  - **color**: Color theming components
  - **font**: Font theming components
- **modal**: Modal components

### Features

The `features` directory contains feature-specific code:

- **cover-letter**: Cover letter functionality
- **resume**: Resume functionality
- **download**: Download functionality
- **upload**: Upload functionality

### Contexts

The `contexts` directory contains React context providers:

- **admin**: Admin context for managing admin state
- **theme**: Theme context for managing theme state
- **content**: Content state context for managing content state

### Hooks

The `hooks` directory contains custom React hooks.

### Utils

The `utils` directory contains utility functions:

- **string**: String manipulation utilities
- **format**: Formatting utilities
- **cache**: Caching utilities

### API

The `api` directory contains API routes and handlers:

- **content**: Content-related API routes
- **pdf**: PDF-related API routes
- **openai**: OpenAI-related API routes

## Philosophical Alignment

The project structure reflects the philosophical approaches of:

- **Dante Alighieri (Structure)**: Hierarchical organization of code
- **Hermann Hesse (Precision)**: Technical precision and intellectual clarity
- **J.D. Salinger (Authenticity)**: Human-readable, authentic representation
- **Jacques Derrida (Deconstruction)**: Breaking down traditional categories

## Dependency Flow

Dependencies flow from higher-level components to lower-level utilities:

1. **Features** depend on **UI Components** and **Contexts**
2. **UI Components** depend on **Core Utilities**
3. **API Routes** depend on **Core Utilities**
4. **Core Utilities** are independent and self-contained

This ensures a clean separation of concerns and prevents circular dependencies.
