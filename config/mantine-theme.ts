import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "var(--font-poppins)", // Use the Poppins font via CSS variable
  colors: {
    dark: [
      "#d5d7e0", // dark[0] - Lightest shade (text, primary highlights)
      "#acaebf", // dark[1] - Slightly darker (secondary text, subtle highlights)
      "#8c8fa3", // dark[2] - Tertiary text, muted labels
      "#666980", // dark[3] - Disabled elements, borders
      "#ffffff1f", // dark[4] - Input borders, subtle backgrounds
      "#34354a", // dark[5] - Card backgrounds, default component background
      "#000", // dark[6] - Sidebar backgrounds, hover backgrounds
      "#111111", // dark[7] - Navbar, deeper backgrounds -- main bg
      "#0c0d21", // dark[8] - Main background (body, main layout background)
      "#01010a", // dark[9] - Deepest areas, footers, modal backdrops
    ],
  },
  // Override background for dark mode
});
