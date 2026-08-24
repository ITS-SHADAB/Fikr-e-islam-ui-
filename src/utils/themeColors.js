export const COLORS = {
  primary: "#4A3728",      // Dark Brown
  secondary: "#D9CFC1",    // Light Beige
  accent: "#B89C7D",       // Soft Gold Brown
  background: "#F7F4EF",   // Warm Off White
  textPrimary: "#2D241D",  // Dark Text
  textSecondary: "#6B5B4B",
  border: "#D8CDBF",
  white: "#FFFFFF",

  color1: "#4A3728",
  color2: "#D9CFC1",
  color3: "#B89C7D",
  color4: "#F7F4EF",

  // Semantic & Utility Colors
  error: "#DE350B",
  success: "#00875A",
  info: "#0177D9",
  infoDark: "#033F7D",
  teal: "#3E8B82",
  grayLight: "#E0E0E0",
};

// Inject CSS variables dynamically into the DOM
if (typeof document !== "undefined") {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", COLORS.primary);
  root.style.setProperty("--color-secondary", COLORS.secondary);
  root.style.setProperty("--color-accent", COLORS.accent);
  root.style.setProperty("--color-background", COLORS.background);
  root.style.setProperty("--color-text-primary", COLORS.textPrimary);
  root.style.setProperty("--color-text-secondary", COLORS.textSecondary);
  root.style.setProperty("--color-border", COLORS.border);
  root.style.setProperty("--color-white", COLORS.white);

  root.style.setProperty("--color-error", COLORS.error);
  root.style.setProperty("--color-success", COLORS.success);
  root.style.setProperty("--color-info", COLORS.info);
  root.style.setProperty("--color-info-dark", COLORS.infoDark);
  root.style.setProperty("--color-teal", COLORS.teal);
  root.style.setProperty("--color-gray-light", COLORS.grayLight);

  // Set the specific legacy variables that components might expect in CSS
  root.style.setProperty("--color-brown-dark", COLORS.primary);
  root.style.setProperty("--color-brown-mid", COLORS.accent);
  root.style.setProperty("--color-brown-light", COLORS.secondary);
  root.style.setProperty("--color-cream", COLORS.secondary);
  root.style.setProperty("--color-cream-light", COLORS.background);
  root.style.setProperty("--color-site-bg", COLORS.background);
  root.style.setProperty("--color-card-bg", COLORS.white);
  root.style.setProperty("--color-text-muted", COLORS.textSecondary);
  root.style.setProperty("--color-site-border", COLORS.border);
  root.style.setProperty("--color-footer-bg", COLORS.background);
  root.style.setProperty("--color-section-hdr", COLORS.primary);
  root.style.setProperty("--color-gold", COLORS.accent);
}

export const SCENE_COLORS = {
  sky1Start: "#c8a880",
  sky1Mid: "#b89060",
  sky1End: "#8a5828",
  wall1Start: "#c08060",
  wall1Mid: "#b06848",
  wall1End: "#904030",
  courtStart: "#e8dcc0",
  courtEnd: "#c8b898",
  dome1Start: "#e8e0d0",
  dome1End: "#c0b8a8",
  bgRects1: "#d0a878",
  bgRects2: "#c89868",
  bgRects3: "#d8b080",
  bgRects4: "#c89060",
  bgRects5: "#d0a870",
  decor1: "#a05838",
  decor2: "#8a3820",
  wall2: "#b86040",
  rectDetail: "#e0d8c8",
  ellipseDetail1: "#c8c0b0",
  circleDetail: "#b0a890",
  stem: "#6a4820",
  leaf1: "#2a5a18",
  leaf2: "#3a6a22",
  leaf3: "#3a5a18",
  ground: "#9a6840",
  sky2Start: "#b89870",
  sky2End: "#7a4820",
  wall3: "#b06040",
  wall3Detail: "#984830",
  decor3: "#8a3020",
  dome2: "#e0d8c8",
  wall4: "#d8d0b8",
  circle2: "#c0b8a0",
  circle3: "#b0a888",
  rect3: "#e0d0a8",
  stem2: "#5a3a18",
  leaf4: "#2a5218",
  leaf5: "#3a6020",
  ground2: "#9a6030"
};

// Reusable Background style helpers
export const bgStyles = {
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  accent: { backgroundColor: COLORS.accent },
  background: { backgroundColor: COLORS.background },
  white: { backgroundColor: COLORS.white },
};

// Reusable Text style helpers
export const textStyles = {
  primary: { color: COLORS.textPrimary },
  secondary: { color: COLORS.textSecondary },
  accent: { color: COLORS.accent },
  white: { color: COLORS.white },
  link: { color: COLORS.primary },
};

// Reusable Border style helpers
export const borderStyles = {
  primary: { borderColor: COLORS.border, borderStyle: "solid", borderWidth: "1px" },
  accent: { borderColor: COLORS.accent, borderStyle: "solid", borderWidth: "1px" },
  none: { borderStyle: "none" },
};

// Reusable Hover state helper
export const getHoverStyle = (isHovered, baseStyle, hoverStyle) => {
  return isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle;
};

// Reusable Card styles
export const cardStyles = {
  premium: {
    backgroundColor: COLORS.white,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: COLORS.border,
    borderRadius: "20px",
    boxShadow: "0 4px 20px -4px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
  },
  premiumHover: {
    boxShadow: "0 12px 24px -4px rgba(184, 156, 125, 0.18)",
    borderColor: COLORS.accent,
  },
};

// Reusable Button styles
export const buttonStyles = {
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: "none",
    borderRadius: "4px",
    transition: "all 0.2s ease",
  },
  primaryHover: {
    backgroundColor: COLORS.textSecondary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    color: COLORS.textPrimary,
    borderColor: COLORS.border,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "4px",
    transition: "all 0.2s ease",
  },
  secondaryHover: {
    backgroundColor: COLORS.background,
  },
  accent: {
    backgroundColor: COLORS.accent,
    color: COLORS.white,
    border: "none",
    borderRadius: "4px",
    transition: "all 0.2s ease",
  },
  accentHover: {
    backgroundColor: COLORS.primary,
  },
};
