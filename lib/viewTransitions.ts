// Names and types shared by both ends of a cross-page view transition.

// Tags a navigation with a direction; PageTransition maps each to a slide.
export const NAV_FORWARD = ['nav-forward'];
export const NAV_BACK = ['nav-back'];

// The card thumbnail on /projects and the first gallery tile on the detail page
// carry this name, so the browser morphs one into the other. Unique per project, so
// it stays unique on the list page and still pairs across the navigation.
export const projectImageName = (id: string) => `project-image-${id}`;

// The card thumbnail's next/image settings. A morph target that requests the
// same `sizes` and `quality` gets the same file, already in the HTTP cache, so
// it is painted the moment the destination commits instead of arriving blank.
export const CARD_IMAGE_SIZES =
  '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
export const CARD_IMAGE_QUALITY = 90;
