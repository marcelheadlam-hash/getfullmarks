/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

// ── PDF endpoints (replace with real hosted URLs when ready) ─────────
const PDF_URLS = {
  higher:     "assets/GFM-Examiner-Report-Patterns-Higher.pdf",
  foundation: "assets/GFM-Examiner-Report-Patterns-Foundation.pdf",
};

// ── Form endpoint (Formspree / similar) ──────────────────────────────
// Replace FORMSPREE_ID with the ID from your Formspree form (free plan: 50 submissions/month).
// Set to null to keep the fake 650ms simulation for local preview.
const FORM_ENDPOINT = "https://formspree.io/f/mnjlvwlj";

function Logo({ size=22 }) {
  return (
    <span className="mark-logo" style={{ width: size, height: size }}>
      <img src="assets/logo.svg" alt="" width={Math.round(size*0.62)} height={Math.round(size*0.62)} />
    </span>
  );
}

function Nav({ right }) {
  return (
    <div className="wrap">
      <nav className="nav">
        <a href="index.html" className="brand" style={{ textDecoration: "none" }}>
          <Logo />
          <span>Get Full Marks</span>
        </a>
        {right}
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <div className="wrap">
      <footer>
        <div>© 2026 Get Full Marks · fullmarks.ai · Built by <a href="mailto:marcelheadlam@gmail.com" style={{ color: "inherit" }}>Marcel</a></div>
        <div><a href="privacy.html">Privacy</a> · <a href="mailto:marcelheadlam@gmail.com">Contact</a></div>
      </footer>
    </div>
  );
}

function SpecBreakdown({ tier }) {
  const activeTier = tier || "both";
  const higher = SPEC.higher;
  const foundation = SPEC.foundation;
  const Bar = ({ weight }) => <span className="spec-bar" style={{ "--w": (weight / 30 * 100) + "%" }} />;
  return (
    <div className="spec" data-tier={activeTier}>
      <div className="spec-head">
        <div className="spec-title">What's on the exam</div>
        <div className="spec-cols">
          <span className={"spec-col-h " + (activeTier === "higher" ? "on" : activeTier === "foundation" ? "off" : "")}>Higher %</span>
          <span className={"spec-col-f " + (activeTier === "foundation" ? "on" : activeTier === "higher" ? "off" : "")}>Foundation %</span>
        </div>
      </div>
      <ul className="spec-rows">
        {higher.map((h, i) => {
          const f = foundation[i];
          return (
            <li key={h.topic} className="spec-row">
              <span className="spec-topic">{h.topic}</span>
              <span className="spec-vals">
                <span className={"spec-val h " + (activeTier === "foundation" ? "dim" : "")}>
                  <Bar weight={h.weight} /><b>{h.weight}%</b>
                </span>
                <span className={"spec-val f " + (activeTier === "higher" ? "dim" : "")}>
                  <Bar weight={f.weight} /><b>{f.weight}%</b>
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="spec-foot">Source: Edexcel 1MA1 specification · Every topic is covered in the PDF</div>
    </div>
  );
}

function App() {
  const [tweaks, setTweaks] = useState(() => ({ ...(window.TWEAK_DEFAULTS || {}) }));
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tier, setTier] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    document.body.dataset.accent = tweaks.accent;
    document.body.dataset.surface = tweaks.surface;
  }, [tweaks.accent, tweaks.surface]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const setTweak = (k, v) => {
    setTweaks(t => ({ ...t, [k]: v }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  const onSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            tier: payload.tier,
            _subject: `New waitlist signup — ${payload.tier} · ${payload.firstName} ${payload.lastName}`,
          }),
        });
        if (!res.ok) throw new Error("Submission failed");
      } else {
        await new Promise(r => setTimeout(r, 650));
      }
      setSubmitted(payload);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError("Couldn't send just now — please try again or email marcelheadlam@gmail.com.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => { setSubmitted(null); setTier(null); };

  const card1 = tier === "foundation" ? FOUNDATION_CARD : HIGHER_CARD;
  const card2 = tier === "foundation" ? SECONDARY_CARD_FOUNDATION : SECONDARY_CARD_HIGHER;
  const H = HEADLINES[tweaks.headline] || HEADLINES.exact;

  if (submitted) return <SuccessView data={submitted} onReset={reset} tweaks={tweaks} tweaksOpen={tweaksOpen} setTweak={setTweak} />;

  return (
    <div className="page">
      <Nav right={<div className="nav-meta">Edexcel 1MA1 · Higher & Foundation</div>} />

      <div className="wrap">
        <section className="hero" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="hero-grid">
            <div>
              <div className="eyebrow">Free PDF · Edexcel 1MA1</div>
              <h1 className="headline" dangerouslySetInnerHTML={{ __html: H.main }} />
              <p className="sub">{H.sub}</p>
              {H.list && (
                <ol className="sub-list">
                  {H.list.map((item, i) => (
                    <li key={i}><span className="n">{String(i+1).padStart(2,"0")}</span>{item}</li>
                  ))}
                </ol>
              )}
              <SpecBreakdown tier={tier} />
            </div>
            <CaptureForm
              tier={tier}
              onTier={setTier}
              onSubmit={onSubmit}
              variant={tweaks.cardVariant === "seg" ? "seg" : "cards"}
              isSubmitting={submitting}
              submitError={submitError}
            />
          </div>
        </section>

        <section>
          <div className="section-head">
            <div className="section-num">02 / Preview</div>
            <h2 className="section-title">What you'll <em>actually</em> get — not a teaser.</h2>
          </div>
          <div className="card-frame">
            <MistakeCard data={card1} />
            <MistakeCard data={card2} />
          </div>
          <p style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
            color: "var(--ink-4)", marginTop: 24, textTransform: "uppercase",
          }}>
            {tier ? "Showing the " + (tier === "foundation" ? "Foundation" : "Higher") + "-tier preview" : "Pick a tier above to switch the preview"}
          </p>
        </section>

        <section className="manifesto">
          <div className="section-head">
            <div className="section-num">03 / Philosophy</div>
            <h2 className="section-title">How we think <em>about this</em>.</h2>
          </div>
          <ol className="manifesto-list">
            <li>
              <div className="mf-kicker">01</div>
              <div className="mf-body">
                <h3>Mistakes are the shortest path to the marks.</h3>
                <p>The students who improve fastest aren't doing more questions — they're studying the errors they and others keep making, and stopping.</p>
              </div>
            </li>
            <li>
              <div className="mf-kicker">02</div>
              <div className="mf-body">
                <h3>At this stage, most of maths is recall.</h3>
                <p>You already know most of what's on the paper. You're losing marks on method, notation, and sign discipline. That's fixable in weeks, not months.</p>
              </div>
            </li>
            <li>
              <div className="mf-kicker">03</div>
              <div className="mf-body">
                <h3>Specificity beats volume.</h3>
                <p>The patterns examiners actually flag will move your grade more than a thousand random practice questions. We'd rather give you those.</p>
              </div>
            </li>
          </ol>
        </section>
      </div>

      <Footer />

      {tweaksOpen && <Tweaks tweaks={tweaks} setTweak={setTweak} />}
    </div>
  );
}

function SuccessView({ data, onReset, tweaks, tweaksOpen, setTweak }) {
  const tierName = data.tier === "higher" ? "Higher Tier" : "Foundation Tier";
  const pdfUrl = PDF_URLS[data.tier];
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + window.location.pathname);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) { /* noop */ }
  };

  return (
    <div className="page">
      <Nav right={<button onClick={onReset} className="nav-meta" style={{ cursor: "pointer" }}>← Back to page</button>} />

      <div className="wrap">
        <div className="success-wrap">
          <div className="success">
            <div className="stamp"><Check size={12} /> Sent · check your inbox</div>
            <h2>
              Your <em>{tierName}</em> PDF is on its way to <em>{data.email}</em>.
            </h2>
            <p>
              Takes about a minute to arrive — sometimes two. If it doesn't show, check your spam folder. You can also grab it right here:
            </p>
            <a className="download" href={pdfUrl} download>
              <Download />
              <span>Download the {tierName} PDF</span>
            </a>

            <div className="success-note">
              <span className="dot" />
              <div>
                <strong>Happy revising</strong> — you got this.
              </div>
            </div>

            <div className="upsell">
              <div className="upsell-inner">
                <div className="upsell-label">Want tutoring as well?</div>
                <h3 className="upsell-title">Book a free intro call.</h3>
                <p className="upsell-body">
                  We'll talk through where you're at right now, then send you off with a paper focused on the topics that you're most likely to be tested on. Finish it in your own time, and we'll send back a ranked plan for the weeks before your exam.
                </p>
                <a className="upsell-cta"
                   href="https://cal.com/marcel-headlam-8ibyhb/30min?overlayCalendar=true"
                   target="_blank"
                   rel="noopener noreferrer">
                  <span>Book an intro call</span>
                  <ArrowRight />
                </a>
                <div className="upsell-meta">Free · 30 min · Online via Cal.com</div>
              </div>
            </div>

            <div className="referral">
              <div className="referral-kicker">Know someone else sitting this?</div>
              <div className="referral-row">
                <button className="referral-btn" onClick={copyLink}>
                  {copied ? <Check size={14} /> : <LinkIcon size={14} />}
                  <span>{copied ? "Link copied" : "Copy share link"}</span>
                </button>
                <a className="referral-btn alt"
                   href={"https://wa.me/?text=" + encodeURIComponent("Found this — examiner mistakes for GCSE Maths: " + (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "https://fullmarks.ai/"))}
                   target="_blank" rel="noopener noreferrer">
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {tweaksOpen && <Tweaks tweaks={tweaks} setTweak={setTweak} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
