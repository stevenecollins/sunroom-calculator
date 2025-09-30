# The Sunroom Experts - Quote Calculator

A modern, user-friendly quote calculator for sunroom installations, featuring a 2-step process with real-time pricing calculations.

## Features

✅ **Complete 4-Step Flow:**
- Landing page with value propositions and room type previews
- Interactive room type selection (Screen, 3-Season, Glass)
- Visual wall diagram with 3 wall inputs
- Real-time price calculation as you type
- Professional contact form with validation
- Thank you confirmation page

✅ **Technical Features:**
- Responsive design for all devices
- Form validation with error handling
- Price calculation based on square footage
- State management for all user inputs
- Smooth screen transitions
- Professional UI with brand colors

## Brand Colors

- **Deep Teal**: #255E65 (Primary brand color)
- **Sage Glass**: #85A3A3 (Accent for buttons/highlights)
- **Warm Alabaster**: #F5F1EC (Background)
- **Driftwood Gray**: #B8C1C8 (Borders/dividers)
- **Oyster Pearl**: #E8E0D6 (Light accents)
- **Charcoal**: #2A3439 (Text)

## File Structure

```
sunroom-calculator/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css     # Complete styling with brand colors
├── js/
│   └── app.js         # JavaScript functionality
├── images/            # Placeholder for sunroom images
└── README.md          # This file
```

## How It Works

1. **Landing Page**: Users see the value proposition with sunroom previews
2. **Step 1 - Calculator**: 
   - Select room type (Screen, 3-Season, or Glass)
   - Enter measurements for 3 walls
   - See real-time price calculations
3. **Step 2 - Contact Form**: 
   - Enter contact information
   - Add project details
   - See final price estimate
4. **Thank You Page**: Confirmation with next steps

## Pricing Logic

The calculator uses square footage-based pricing:
- **Screen Only**: $35-50/sq ft ($2,800-$4,000 minimum)
- **3-Season Eze Breeze**: $50-65/sq ft ($6,000-$10,000 minimum)
- **Glass Sunroom**: $75-100/sq ft ($12,000-$20,000 minimum)

Formula: `Total Linear Feet × Wall Height (8ft default) × Price per Sq Ft`

## Setup Instructions

1. Open `index.html` in your browser to test locally
2. Add actual sunroom images to the `/images` folder:
   - `glass-sunroom.jpg`
   - `eze-breeze.jpg`
   - `screen-room.jpg`
3. Connect to your backend API for form submission (see `submitToServer` function in app.js)

## Integration Points

The form submission creates a data object with:
- Contact information
- Room type and dimensions
- Calculated price range
- Timestamp and metadata

This can be sent to your WordPress site or any backend API.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Consider adding:
- [ ] Additional room types (covered porch option)
- [ ] Email confirmation system
- [ ] Save and resume functionality
