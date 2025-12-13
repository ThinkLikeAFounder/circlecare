# Features Page

This directory contains the code for the CircleCare features page, which showcases the platform's capabilities and includes user testimonials.

## Components

1. **FeatureHighlights** - Displays the main features of CircleCare with icons and descriptions.
2. **ClarityShowcase** - Highlights the Clarity 4 integration and its benefits.
3. **Testimonials** - Shows user testimonials with ratings and avatars.

## Adding Testimonials

To add a new testimonial, edit the `Testimonials.tsx` file and add a new object to the `testimonials` array:

```typescript
{
  name: 'Full Name',
  role: 'Position/Title',
  quote: 'Testimonial text goes here.',
  avatar: '/avatars/avatar.jpg', // Place avatar image in public/avatars/
  rating: 5, // Rating out of 5
}
```

## Updating Features

To update the features list, modify the respective arrays in:

- `FeatureHighlights.tsx` - For main features
- `ClarityShowcase.tsx` - For Clarity 4 specific features

## Styling

The page uses Tailwind CSS for styling. The color scheme and spacing follow the project's design system.

## SEO

The page includes metadata for search engines and social sharing. Update the `metadata` object in `page.tsx` to modify the page title, description, and keywords.

## Responsive Design

The page is fully responsive and works on mobile, tablet, and desktop devices.
