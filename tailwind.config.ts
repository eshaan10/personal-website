import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          // surface / background stops
          900: "#0E0E0F",
          800: "#1B1B1D",
        },
        // Routed through CSS variables so recruiter mode can repaint the
        // whole site light without every component opting in.
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        glass: {
          fill: "var(--glass-fill)",
          "fill-strong": "var(--glass-fill-strong)",
          border: "var(--glass-border)",
          "border-soft": "var(--glass-border-soft)",
        },
        paper: "var(--paper)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        label: "0.18em",
      },
      borderRadius: {
        glass: "14px",
      },
      backdropBlur: {
        glass: "13px",
      },
      transitionTimingFunction: {
        // no default ease-in-out anywhere — see CLAUDE.md
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
        exit: "cubic-bezier(0.4, 0, 0.2, 1)",
        drift: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      keyframes: {
        // Wide drift paths — the distance travelled is what makes the motion
        // legible. Durations stay long (19s/26s below) so covering more ground
        // reads as ambient rather than as something moving quickly.
        "blob-a": {
          "0%":   { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%":  { transform: "translate3d(14vw, -10vh, 0) scale(1.18)" },
          "66%":  { transform: "translate3d(-9vw, 12vh, 0) scale(0.86)" },
          "100%": { transform: "translate3d(0, 0, 0) scale(1)" },
        },
        "blob-b": {
          "0%":   { transform: "translate3d(0, 0, 0) scale(1)" },
          "40%":  { transform: "translate3d(-16vw, 11vh, 0) scale(0.84)" },
          "75%":  { transform: "translate3d(11vw, 16vh, 0) scale(1.24)" },
          "100%": { transform: "translate3d(0, 0, 0) scale(1)" },
        },
        "rise-in": {
          "0%":   { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        // halo behind the "present" node — slow enough to read as alive, not as a spinner
        breathe: {
          "0%, 100%": { opacity: "0.42", transform: "scale(1)" },
          "50%":      { opacity: "0.06", transform: "scale(2.1)" },
        },
        // Odometer/flip-clock pair: both travel upward, hinging away from the
        // viewer at the edge they leave through.
        "flip-out-up": {
          "0%":   { transform: "translateY(0) rotateX(0deg)", opacity: "1" },
          "70%":  { opacity: "0" },
          "100%": { transform: "translateY(-80%) rotateX(45deg)", opacity: "0" },
        },
        "flip-in-up": {
          "0%":   { transform: "translateY(80%) rotateX(-45deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotateX(0deg)", opacity: "1" },
        },
      },
      animation: {
        // deliberately non-synced durations so the two blobs never beat together
        "blob-a": "blob-a 19s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "blob-b": "blob-b 26s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "rise-in": "rise-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        breathe: "breathe 4.5s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        // Exit curve out, entrance curve in — the incoming phrase settles
        // rather than arriving at a constant rate. The 150ms delay on the
        // incoming keeps the two from occupying the line at full opacity
        // simultaneously, which reads as blurred double text rather than as
        // one panel replacing another.
        "flip-out-up": "flip-out-up 400ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "flip-in-up": "flip-in-up 520ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both",
      },
    },
  },
  plugins: [],
};

export default config;
