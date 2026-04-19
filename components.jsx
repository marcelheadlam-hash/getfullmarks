/* global React */
const { useState, useEffect, useRef } = React;

// ── Icons ─────────────────────────────────────────────
const ArrowRight = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
const Download = ({size=16}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v9M4 7l4 4 4-4M2.5 13.5h11" />
  </svg>
);
const Check = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5l3.5 3.5L13 4.5" />
  </svg>
);
const LinkIcon = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 9.5a3 3 0 0 0 4.24 0l2-2a3 3 0 1 0-4.24-4.24l-.75.75M9.5 6.5a3 3 0 0 0-4.24 0l-2 2a3 3 0 1 0 4.24 4.24l.75-.75" />
  </svg>
);

// ── Tier selector ────────────────────────────────────
function TierSelector({ value, onChange, variant="cards" }) {
  if (variant === "seg") {
    return (
      <div className="tier-seg" role="radiogroup" aria-label="Tier">
        {value && <div className="thumb" data-pos={value === "foundation" ? 1 : 0} />}
        <button
          role="radio" aria-checked={value === "higher"}
          onClick={() => onChange("higher")}>
          Higher Tier
        </button>
        <button
          role="radio" aria-checked={value === "foundation"}
          onClick={() => onChange("foundation")}>
          Foundation Tier
        </button>
      </div>
    );
  }
  return (
    <div className="tier-group" role="radiogroup" aria-label="Tier">
      <button
        className="tier"
        role="radio"
        aria-checked={value === "higher"}
        onClick={() => onChange("higher")}>
        <div className="tier-row">
          <span className="radio" />
          <span className="name">Higher</span>
        </div>
        <div className="desc">1H · 2H · 3H<br/>Grades 4–9 · 2019–2024</div>
      </button>
      <button
        className="tier"
        role="radio"
        aria-checked={value === "foundation"}
        onClick={() => onChange("foundation")}>
        <div className="tier-row">
          <span className="radio" />
          <span className="name">Foundation</span>
        </div>
        <div className="desc">1F · 2F · 3F<br/>Grades 1–5 · 2022–2024</div>
      </button>
    </div>
  );
}

// ── Capture form ─────────────────────────────────────
function CaptureForm({ tier, onTier, onSubmit, variant, isSubmitting, submitError }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const canSubmit = !!tier && firstName.trim().length > 0 && lastName.trim().length > 0 && /.+@.+\..+/.test(email) && !isSubmitting;
  return (
    <form className="capture" onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit({ tier, firstName: firstName.trim(), lastName: lastName.trim(), name: `${firstName.trim()} ${lastName.trim()}`, email: email.trim() }); }}>
      <div className="capture-label">
        <span>1. Choose your tier</span>
        <span>{tier ? <Check size={12} /> : "Required"}</span>
      </div>
      <TierSelector value={tier} onChange={onTier} variant={variant} />

      <div className="capture-label">
        <span>2. Where should we send it?</span>
        <span>{firstName && lastName && /.+@.+\..+/.test(email) ? <Check size={12} /> : ""}</span>
      </div>
      <div className="fields">
        <div className="field">
          <label>First</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" autoComplete="given-name" />
        </div>
        <div className="field">
          <label>Last</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" autoComplete="family-name" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" autoComplete="email" />
        </div>
      </div>
      <button className="cta" type="submit" disabled={!canSubmit}>
        {isSubmitting ? "Sending…" : <>Send me the PDF <ArrowRight /></>}
      </button>
      {submitError && <p className="submit-error">{submitError}</p>}
      <p className="microcopy">
        <strong>No spam.</strong> Occasionally we'll send a short note when we publish something new. One click to unsubscribe.
      </p>
    </form>
  );
}

// ── Mistake card ─────────────────────────────────────
function Part({ n, label, children, variant }) {
  return (
    <div className={`mcard-part ${variant || ""}`}>
      <div className="mcard-part-label">
        <span className="n">{n}</span>{label}
      </div>
      {children}
    </div>
  );
}

function MistakeCard({ data }) {
  return (
    <article className="mcard">
      <header className="mcard-head">
        <div>
          <div className="mcard-topic">{data.topic}</div>
          <h3 className="mcard-title">{data.title}</h3>
        </div>
      </header>
      <Part n="1" label="Example question">
        <p dangerouslySetInnerHTML={{ __html: data.question }} />
      </Part>
      <Part n="2" label="The common mistake" variant="mistake">
        <p dangerouslySetInnerHTML={{ __html: data.mistake }} />
      </Part>
      <Part n="3" label="The correct method">
        <p dangerouslySetInnerHTML={{ __html: data.method }} />
      </Part>
      <Part n="4" label="Example answer" variant="answer">
        <pre className="mcard-working" dangerouslySetInnerHTML={{ __html: data.answer }} />
      </Part>
    </article>
  );
}

// ── Tweaks panel ─────────────────────────────────────
function Tweaks({ tweaks, setTweak }) {
  const accents = [
    { id: "clay",       css: "oklch(0.55 0.12 40)" },
    { id: "deep-green", css: "oklch(0.42 0.08 150)" },
    { id: "ink-blue",   css: "oklch(0.42 0.08 245)" },
    { id: "ink-only",   css: "#0E0E0C" },
  ];
  return (
    <aside className="tweaks">
      <div className="tweaks-title"><span>Tweaks</span><span>v1</span></div>

      <div className="tweak-row">
        <div className="k">Accent</div>
        <div className="swatches">
          {accents.map(a => (
            <button key={a.id}
              onClick={() => setTweak("accent", a.id)}
              className={tweaks.accent === a.id ? "on" : ""}
              style={{ background: a.css }}
              aria-label={a.id} />
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <div className="k">Tier selector</div>
        <div className="seg">
          <button className={tweaks.cardVariant === "numbered" ? "on" : ""} onClick={() => setTweak("cardVariant", "numbered")}>Cards</button>
          <button className={tweaks.cardVariant === "seg" ? "on" : ""} onClick={() => setTweak("cardVariant", "seg")}>Segmented</button>
        </div>
      </div>

      <div className="tweak-row">
        <div className="k">Headline</div>
        <div className="seg">
          <button className={tweaks.headline === "exact" ? "on" : ""} onClick={() => setTweak("headline", "exact")}>Exact</button>
          <button className={tweaks.headline === "patterns" ? "on" : ""} onClick={() => setTweak("headline", "patterns")}>Patterns</button>
          <button className={tweaks.headline === "wrong" ? "on" : ""} onClick={() => setTweak("headline", "wrong")}>Wrong</button>
        </div>
      </div>

      <div className="tweak-row">
        <div className="k">Surface</div>
        <div className="seg">
          <button className={tweaks.surface === "paper" ? "on" : ""} onClick={() => setTweak("surface", "paper")}>Paper</button>
          <button className={tweaks.surface === "white" ? "on" : ""} onClick={() => setTweak("surface", "white")}>White</button>
          <button className={tweaks.surface === "ink" ? "on" : ""} onClick={() => setTweak("surface", "ink")}>Ink</button>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { ArrowRight, Download, Check, LinkIcon, TierSelector, CaptureForm, MistakeCard, Tweaks });
