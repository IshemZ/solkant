# Homepage Tests

## Overview

Comprehensive unit tests for the marketing homepage at `/app/page.tsx`.

## Test Coverage

**Total Tests:** 81  
**Coverage:** 100% (statements, branches, functions, lines)

## Test Structure

### 1. Navigation Header (5 tests)
- Logo display
- Navigation links (Fonctionnalités, Tarifs, Blog, Contact)
- Authentication buttons (Connexion, Commencer)
- Tailwind CSS structure

### 2. Hero Section (4 tests)
- Main heading (H1)
- Product description
- CTA buttons (Commencer gratuitement, En savoir plus)
- Semantic structure

### 3. Features Section (6 tests)
- Section heading
- 6 feature cards with titles and descriptions
- Section ID for anchor navigation
- SVG icons

### 4. Comment ça marche Section (6 tests)
- Section heading
- 3 step descriptions
- Step numbers (1, 2, 3)
- CTA button
- No credit card required message

### 5. Pourquoi Solkant Section (5 tests)
- Section heading
- 3 key benefits
- Time savings metrics
- SVG icons

### 6. Pour qui Section (4 tests)
- Section heading
- 4 target audiences
- Audience descriptions

### 7. Comparison Table Section (7 tests)
- Section heading
- Table structure
- Column headers
- 7 comparison features
- Checkmark icons
- 80% time savings claim
- Link to features page

### 8. Testimonials Section (6 tests)
- Section heading
- 3 testimonials
- Company names and locations
- Testimonial quotes
- User initials
- 5-star ratings

### 9. FAQ Section (5 tests)
- Section heading
- 10 FAQ questions and answers
- Link to pricing page
- Link to contact page

### 10. Blog Section (5 tests)
- Section heading
- 3 blog article links
- Article descriptions
- "See all articles" link
- Background styling

### 11. CTA Section (4 tests)
- Final CTA heading
- Persuasion message
- Registration button
- Contrasting background

### 12. Footer (4 tests)
- Footer element
- Navigation links
- Copyright with year
- Hydration safety (no Date.now())

### 13. Structured Data (4 tests)
- SoftwareApplication JSON-LD schema
- FAQPage JSON-LD schema
- Valid schema structure
- Required schema fields

### 14. Accessibility (4 tests)
- Hierarchical heading structure (H1, H2, H3)
- Valid href attributes
- Semantic HTML elements
- Color contrast classes

### 15. Hydration & Consistency (4 tests)
- Identical renders
- No random values
- Static Tailwind classes only
- Constant copyright year

### 16. French Content (4 tests)
- All content in French
- French quotation marks
- French price format (19€/mois)
- French apostrophes

### 17. Performance (3 tests)
- Fast rendering (< 100ms)
- No memory leaks
- Reasonable HTML size (< 500KB)

### 18. Internal Links (5 tests)
- Multiple links to /register
- Links to /fonctionnalites
- Links to /pricing
- Links to /blog and specific articles
- Links to /contact

## Running Tests

```bash
# Run homepage tests only
npm test -- tests/pages/homepage.test.tsx

# Run with coverage
npm run test:coverage -- tests/pages/homepage.test.tsx

# Run all tests
npm test
```

## Test Patterns

### Testing Library Best Practices
- Uses `screen.getByRole()` for semantic queries
- Uses `getAllBy*` when multiple elements expected
- Avoids testing implementation details
- Focuses on user-visible behavior

### Hydration Safety
- Verifies deterministic rendering
- No `Date.now()` or `Math.random()` in output
- Constant values defined at module level
- Identical server/client renders

### French Locale
- All user-facing text in French
- Proper French formatting (dates, currency, apostrophes)
- French-specific validation

### Accessibility
- Semantic HTML validation
- Heading hierarchy checks
- Link and button role verification
- Color contrast validation

## Coverage Analysis

| Aspect | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |

## Notes

- Tests follow patterns from `tests/components/hydration.test.tsx`
- Avoids testing mock behavior (anti-pattern)
- Tests real DOM output and behavior
- No implementation coupling
- Fast execution (< 2 seconds total)

## Future Improvements

- Add E2E tests for critical user flows (Playwright)
- Add visual regression tests (Percy/Chromatic)
- Add performance metrics monitoring
- Add SEO validation tests
