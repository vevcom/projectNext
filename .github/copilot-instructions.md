# Copilot Review Instructions

## Service Operation Naming Conventions

When reviewing code in `src/services/`, enforce the following naming consistency rules:

### Schema names must match operation names

If a `dataSchema` or `paramsSchema` is taken from a schemas object (e.g. `fooSchemas`), the key used must match the operation name exactly.

**Correct:**
```typescript
// operation name: "create"
create: defineOperation({
    dataSchema: fooSchemas.create,       // ✓ matches
    paramsSchema: fooSchemas.create,     // ✓ matches
    authorizer: () => fooAuth.create.dynamicFields({}),
})
```

**Incorrect:**
```typescript
// operation name: "destroyBar"
destroyBar: defineOperation({
    dataSchema: fooSchemas.createBar,    // ✗ should be fooSchemas.destroyBar
    authorizer: () => fooAuth.destroyBar.dynamicFields({}),
})
```

### Authorizer name must match operation name

The key used in the auth object must match the operation name exactly.

**Correct:**
```typescript
// operation name: "readMany"
readMany: defineOperation({
    authorizer: () => fooAuth.readMany.dynamicFields({}),  // ✓ matches
})
```

**Incorrect:**
```typescript
// operation name: "readMany"
readMany: defineOperation({
    authorizer: () => fooAuth.read.dynamicFields({}),      // ✗ should be fooAuth.readMany
})
```

### Summary

For every `defineOperation()` call, the operation key (e.g. `destroyBar`) must align with:
- `dataSchema`: `<domainSchemas>.destroyBar` (if a schemas object is used)
- `paramsSchema`: `<domainSchemas>.destroyBar` (if a schemas object is used)
- `authorizer`: `<domainAuth>.destroyBar.dynamicFields(...)`
