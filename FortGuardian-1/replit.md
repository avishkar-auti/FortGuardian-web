# Fort Guardian - Heritage Conservation Website

## Overview

Fort Guardian is a static website dedicated to heritage conservation in Maharashtra, India. The site focuses on organizing fort cleaning campaigns, eco-friendly camping experiences, and promoting environmental sustainability through community engagement. It serves as a platform for volunteers to participate in heritage preservation activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript
- **Structure**: Multi-page static website with folder-based organization
- **Navigation**: Consistent header navigation across all pages with mobile hamburger menu
- **Responsive Design**: Mobile-first approach with CSS media queries
- **UI Framework**: Custom CSS with Font Awesome icons for consistency

### Page Structure
The website consists of 9 main pages, each in its own folder:
- **Index**: Landing page with hero section and call-to-action buttons
- **Events**: Event listing with filtering capabilities
- **Registration**: Event registration form with validation
- **Volunteer**: Volunteer signup with application form
- **Gallery**: Photo gallery with filtering by event type
- **Testimonials**: User testimonials with submission form
- **About**: Organization information and mission statement
- **Contact**: Contact form and organization details
- **FAQ**: Frequently asked questions with accordion interface

## Key Components

### Navigation System
- Fixed header with logo and navigation menu
- Mobile-responsive hamburger menu
- Active state indicators for current page
- Consistent navigation structure across all pages

### Form Handling
- Client-side validation for all forms (registration, volunteer, contact, testimonials)
- Validation rules for name patterns, email format, phone numbers
- Success modals for form submissions
- Error handling with user-friendly messages

### Interactive Features
- Event filtering by category (cleaning, camping, trekking)
- Gallery filtering by event type
- FAQ accordion functionality
- Smooth scrolling navigation
- Mobile menu toggle functionality

### Visual Design
- Brown color scheme reflecting heritage theme
- Consistent typography and spacing
- Card-based layout for content sections
- CSS animations for scroll-triggered effects
- Responsive grid layouts

## Data Flow

### Client-Side Processing
1. **Form Validation**: JavaScript validates user input before submission
2. **Content Filtering**: Real-time filtering of events and gallery items
3. **UI State Management**: Mobile menu states, accordion states, modal visibility
4. **Navigation**: Smooth scrolling and active state management

### Static Content Structure
- Events data embedded in HTML with data attributes for filtering
- Gallery items with category classification
- FAQ content with expandable sections
- Testimonials display with rating system

## External Dependencies

### Third-Party Libraries
- **Font Awesome 6.0.0**: Icon library for consistent iconography
- **CDN Delivery**: Font Awesome loaded via CDN for performance

### Browser APIs
- **Local Storage**: Could be implemented for form data persistence
- **Geolocation**: Potential for location-based event filtering
- **Responsive Design**: CSS media queries for device compatibility

## Deployment Strategy

### Static Hosting
- **Architecture**: Pure static files suitable for any web server
- **File Structure**: Organized by page with separate CSS/JS files
- **Assets**: Images and icons loaded via CDN or local storage
- **Performance**: Optimized for fast loading with minimal dependencies

### Scalability Considerations
- **Backend Integration**: Forms currently use client-side validation only
- **Database**: No current database, but structure supports future integration
- **API Integration**: Registration and contact forms ready for backend processing
- **Content Management**: Static content could be migrated to CMS system

### Technical Requirements
- **Browser Support**: Modern browsers with ES6 JavaScript support
- **Mobile Compatibility**: Responsive design for all device sizes
- **SEO Optimization**: Semantic HTML structure with proper meta tags
- **Accessibility**: Basic accessibility features with semantic markup

The current architecture provides a solid foundation for a heritage conservation website with room for future enhancements including backend integration, database connectivity, and dynamic content management.