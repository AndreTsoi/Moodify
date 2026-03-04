import { useState, useEffect, useRef } from "react";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500&display=swap"
    rel="stylesheet"
  />
);

const TRACKS = [
  { name: "Blinding Lights",     artist: "The Weeknd",      energy: 0.80, valence: 0.33, danceability: 0.51, acousticness: 0.00, tempo: 171 },
  { name: "Levitating",          artist: "Dua Lipa",         energy: 0.76, valence: 0.91, danceability: 0.70, acousticness: 0.00, tempo: 103 },
  { name: "drivers license",     artist: "Olivia Rodrigo",   energy: 0.43, valence: 0.13, danceability: 0.55, acousticness: 0.80, tempo:  84 },
  { name: "Stay",                artist: "The Kid LAROI",    energy: 0.85, valence: 0.60, danceability: 0.78, acousticness: 0.04, tempo: 170 },
  { name: "Shivers",             artist: "Ed Sheeran",       energy: 0.80, valence: 0.93, danceability: 0.83, acousticness: 0.06, tempo: 141 },
  { name: "Good 4 U",            artist: "Olivia Rodrigo",   energy: 0.66, valence: 0.68, danceability: 0.56, acousticness: 0.01, tempo: 166 },
  { name: "Peaches",             artist: "Justin Bieber",    energy: 0.52, valence: 0.66, danceability: 0.73, acousticness: 0.36, tempo:  90 },
  { name: "Leave The Door Open", artist: "Silk Sonic",       energy: 0.46, valence: 0.74, danceability: 0.74, acousticness: 0.16, tempo:  95 },
];

function computeGradient(tracks) {
  if (!tracks.length) return ["#d4d0c8", "#b8b4aa"];
  const n = tracks.length;
  const e = tracks.reduce((s, t) => s + t.energy,       0) / n;
  const v = tracks.reduce((s, t) => s + t.valence,      0) / n;
  const d = tracks.reduce((s, t) => s + t.danceability, 0) / n;
  const a = tracks.reduce((s, t) => s + t.acousticness, 0) / n;

  const h1  = Math.round(210 - v * 155);
  const h2  = Math.round(h1 + 25 + d * 30);
  const sat = Math.round(18 + e * 38 - a * 10);
  const l1  = Math.round(62 + v * 14);
  const l2  = Math.round(l1 - 12);

  return [`hsl(${h1},${sat}%,${l1}%)`, `hsl(${h2},${sat + 6}%,${l2}%)`];
}

function getMood(tracks) {
  if (!tracks.length) return "—";
  const n = tracks.length;
  const e = tracks.reduce((s, t) => s + t.energy,  0) / n;
  const v = tracks.reduce((s, t) => s + t.valence, 0) / n;
  if (e > 0.65 && v > 0.65) return "Euphoric";
  if (e > 0.65 && v <= 0.65) return "Tense";
  if (e <= 0.65 && v > 0.65) return "Serene";
  if (e <= 0.40 && v <= 0.35) return "Melancholic";
  return "Pensive";
}

function TrackRow({ track, index, active, onToggle }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onToggle(index)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        all: "unset", display: "flex", alignItems: "baseline", gap: 16,
        padding: "11px 0", borderBottom: "1px solid #e8e5e0",
        cursor: "pointer", width: "100%", boxSizing: "border-box",
        opacity: active ? 1 : hover ? 0.55 : 0.32,
        transition: "opacity 0.18s",
      }}
    >
      <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, color: "#aaa", width: 20, flexShrink: 0, letterSpacing: "0.04em" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 15, color: "#1a1a18", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {track.name}
      </span>
      <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, color: "#999", flexShrink: 0 }}>
        {track.artist}
      </span>
    </button>
  );
}

function Meter({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 11 }}>
      <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 10, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", width: 90, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#e0ddd8" }}>
        <div style={{ height: "100%", width: `${Math.round(value * 100)}%`, background: color, transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 10, color: "#ccc", width: 24, textAlign: "right" }}>
        {Math.round(value * 100)}
      </span>
    </div>
  );
}

export default function Moodify() {
  const [active, setActive] = useState(new Set([0, 1, 4, 7]));
  const [angle, setAngle] = useState(135);
  const rafRef = useRef(null);
  const t0 = useRef(Date.now());

  const selected = TRACKS.filter((_, i) => active.has(i));
  const [c1, c2] = computeGradient(selected);
  const mood = getMood(selected);
  const avg = (key) => selected.length ? selected.reduce((s, t) => s + t[key], 0) / selected.length : 0;

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - t0.current) / 1000;
      setAngle(135 + Math.sin(elapsed * 0.12) * 18);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const toggle = (i) => setActive(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <>
      <FontLink />
      <div style={{ minHeight: "100vh", background: "#f5f3ef", display: "flex", flexDirection: "column" }}>

        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 40px", borderBottom: "1px solid #e0ddd8" }}>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, color: "#1a1a18" }}>Moodify</span>
          <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 10, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase" }}>Playlist Mood Visualizer</span>
        </header>

        <main style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: 920, margin: "0 auto", width: "100%", padding: "0 40px", boxSizing: "border-box" }}>

          {/* Track list */}
          <div style={{ paddingRight: 48, paddingTop: 36, paddingBottom: 40, borderRight: "1px solid #e0ddd8" }}>
            <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 10, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Toggle tracks</p>
            {TRACKS.map((track, i) => (
              <TrackRow key={i} track={track} index={i} active={active.has(i)} onToggle={toggle} />
            ))}
          </div>

          {/* Mood panel */}
          <div style={{ paddingLeft: 48, paddingTop: 36, paddingBottom: 40, display: "flex", flexDirection: "column" }}>

            {/* Gradient swatch */}
            <div style={{
              width: "100%", aspectRatio: "16/7", borderRadius: 3,
              background: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
              transition: "background 1.4s ease",
              marginBottom: 28,
            }} />

            {/* Mood label */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 10, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Current mood</p>
              <h1 style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 54, color: "#1a1a18", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {mood}
              </h1>
              <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, color: "#bbb", marginTop: 10 }}>
                {selected.length} track{selected.length !== 1 ? "s" : ""}
                {selected.length > 0 && <> · {Math.round(avg("tempo"))} BPM avg</>}
              </p>
            </div>

            {/* Meters */}
            <div>
              <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 10, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Audio features</p>
              <Meter label="Energy"       value={avg("energy")}       color={c1} />
              <Meter label="Valence"      value={avg("valence")}      color={c2} />
              <Meter label="Danceability" value={avg("danceability")} color={c1} />
              <Meter label="Acousticness" value={avg("acousticness")} color={c2} />
            </div>

          </div>
        </main>
      </div>
    </>
  );
}