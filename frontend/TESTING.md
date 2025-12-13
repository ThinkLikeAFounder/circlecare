# Testing Documentation

## Available Scripts

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:ui` - Run tests with UI

## Writing Tests

- Place test files next to the component with `.test.tsx` extension
- Use `@testing-library/react` for component testing
- Use `vitest` for unit testing utilities and hooks

## Test Structure

- `__tests__` - Test files
- `tests/setup.ts` - Global test setup
- `vitest.config.ts` - Test configuration

## Best Practices

- Test component rendering
- Test user interactions
- Test edge cases
- Keep tests isolated and independent
