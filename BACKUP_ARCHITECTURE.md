# Backup Architecture Documentation

## Overview
This document describes the backup/restore functionality architecture that preserves all app-specific data while maintaining JSON Resume compatibility.

## Architecture Principles

### 1. Clean Separation of Concerns
- **JSON Resume Data**: Standard format, completely unchanged
- **App Extensions**: Separate `$extensions` namespace for all app-specific features
- **Export vs Backup**: Different use cases, different implementations

### 2. Schema Evolution Strategy

**Versioning**: Semantic versioning (MAJOR.MINOR.PATCH)
- **MAJOR**: Breaking changes (can't read old backups without migration)
- **MINOR**: New features (old backups still work with defaults)
- **PATCH**: Bug fixes, clarifications

**Guidelines**:
- Never modify existing fields - always add new ones
- All new fields must have sensible defaults
- Document all changes with migration notes
- Test backwards compatibility rigorously

### 3. Data Structure

```json
{
  // Standard JSON Resume (unchanged)
  "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  "basics": { ... },
  "work": [ ... ],
  // ... other standard sections
  
  // App extensions (separate namespace)
  "$extensions": {
    "$schemaVersion": "1.0.0",
    "$extendedSchema": "https://github.com/user/repo/schemas/extended-resume-v1.json",
    
    "visibility": {
      "sections": { "basics": true, "work": false, ... },
      "items": {
        "work": [true, false, true],      // indexed by array position
        "profiles": [true, true, false]
      },
      "subItems": {
        "work": {
          "0": { "highlights": [true, false, true] },  // work[0].highlights visibility
          "1": { "highlights": [true, true] }
        }
      }
    },
    
    "backup": {
      "exportedAt": "2024-01-01T00:00:00.000Z",
      "exportedBy": "No Strings Resume Builder",
      "appVersion": "1.0.0",
      "format": "extended",
      "preservesVisibility": true,
      "preservesAppData": true
    },
    
    "nonConforming": { ... },  // Import validation issues
    "app": { ... }             // App metadata
  }
}
```

## Benefits of This Architecture

### 1. Maintainability
- No interface duplication
- Easy to add new extensions
- Clear separation between standard and app-specific data

### 2. Compatibility
- Perfect JSON Resume compatibility for exports
- Future-proof schema evolution
- Backwards compatibility with migration strategy

### 3. Clarity
- Easy to see what's standard vs. extended
- Simple to strip extensions for clean export
- Clear responsibility boundaries

## Usage Patterns

### Backup (Preserves Everything)
```typescript
// Editor page - creates backup with all visibility settings
exportAsBackup(resumeData);
```

### Export (Clean JSON Resume)
```typescript
// View page - creates clean JSON Resume for sharing
exportResumeAsJson(resumeData);  // strips visibility extensions
```

### Import/Restore
```typescript
// Handles both backup files and standard JSON Resume
const result = importFromBackup(fileContent);
if (result.isExtended) {
  // Backup file - restore with all settings
} else {
  // Standard JSON Resume - use regular import with defaults
}
```

## Migration Strategy

When breaking changes are needed:

1. Bump MAJOR version
2. Create migration function
3. Update validation to detect old versions
4. Provide clear error messages with migration instructions

Example:
```typescript
// Future v2.0.0 migration
function migrateV1ToV2(v1Data: ExtendedResumeDataV1): ExtendedResumeDataV2 {
  // Transform data structure
  // Add new required fields with defaults
  // Update version numbers
}
```

## Testing Strategy

- **Unit tests**: Conversion functions (both directions)
- **Integration tests**: Full backup/restore cycle
- **Compatibility tests**: Load backups from previous versions
- **Schema validation**: Ensure valid JSON Resume output

## Future Extensions

The architecture supports easy addition of new features:

```typescript
interface Extensions {
  // ... existing fields
  
  // Future additions (backwards compatible)
  theme?: ThemeExtensions;           // v1.1.0
  collaboration?: CollabExtensions;  // v1.2.0
  analytics?: AnalyticsExtensions;   // v1.3.0
}
``` 