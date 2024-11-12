export const GRAVITATIONAL_CONSTANT = 6.6743e-11;
export const SCALE_FACTOR = 0.0001;

export const SPAWN_RADIUS = 250;

// Physical properties
export const SUN_RADIUS = 15; // Used for physics calculations
export const SUN_MASS = Math.round((4 / 3) * Math.PI * Math.pow(SUN_RADIUS, 3) * 1410) / 100;

// Visual properties
export const SUN_VISUAL_SCALE = 2; // This can be changed to adjust visual size
export const SUN_VISUAL_RADIUS = SUN_RADIUS * SUN_VISUAL_SCALE; // This will define the visual size of the sun
