// Real mistake-card content, lifted from the examiner report data.
// Original copy — cards rendered in the site's own type system.

const HIGHER_CARD = {
  topic: "Higher · Number",
  title: "Surds — clearing the root from the bottom",
  citations: "Paper 3H · Q17 · 2023",
  question: "Simplify <b>5 ÷ (√3 − 1)</b>. Give your answer in the form <i>a + b</i>√3.",
  mistake: "Students multiply top and bottom by <strong>(√3 − 1)</strong> — the same expression — instead of its sign-flipped partner <strong>(√3 + 1)</strong>. The bottom never rationalises and a square root stays where it shouldn't.",
  method: "Flip the sign in the bottom: use (√3 + 1). Now the bottom collapses via difference of squares: (√3)² − 1² = 2. Expand the top: 5(√3 + 1) = 5√3 + 5. Divide.",
  answer: `<span>× by (√3 + 1) / (√3 + 1)</span>

bottom:  (√3)² − 1²  =  3 − 1  =  2
top:     5(√3 + 1)   =  5√3 + 5
────────────────────────
answer:  <span class="good">(5 + 5√3) / 2</span>`,
};

const FOUNDATION_CARD = {
  topic: "Foundation · Number",
  title: "Estimation — round before, not after",
  citations: "Paper 2F · Q11 · 2024",
  question: "By rounding each value to 1 significant figure, estimate <b>(318 × 5.2) ÷ 0.47</b>.",
  mistake: "Students calculate <strong>318 × 5.2 ÷ 0.47 = 3 518.30</strong> on the calculator, then round the final answer to 4 000. It looks like an estimate. It scores zero — the rounding has to happen first.",
  method: "Round every value to 1 s.f. <em>before</em> you touch the calculator. Show the rounded numbers. Then compute with the round numbers — no second rounding at the end.",
  answer: `<span class="bad">318 × 5.2 ÷ 0.47 = 3 518.30  →  ≈ 4 000</span>

round first to 1 s.f.
  318   →  300
  5.2   →  5
  0.47  →  0.5

300 × 5 = 1 500
1 500 ÷ 0.5 = <span class="good">3 000</span>`,
};

// A second card to show the system, not just one sample
const SECONDARY_CARD_HIGHER = {
  topic: "Higher · Statistics",
  title: "Cumulative frequency — quarters, not halves",
  citations: "Paper 2H · Q15 · 2022",
  question: "A cumulative frequency graph shows exam scores for <b>80 students</b>. Find the interquartile range.",
  mistake: "Students read across at <strong>CF = 40</strong> (that's the median) — or at CF = 20 and CF = 40, splitting the data in half instead of in quarters.",
  method: "n = 80. Lower quartile at CF = 80 ÷ 4 = 20. Upper quartile at CF = 3 × 80 ÷ 4 = 60. Read across to the curve, down to the score axis, then subtract.",
  answer: `n = 80

LQ at CF = 20   →  read across
UQ at CF = 60   →  read across
──────────────────────────
IQR = UQ − LQ

<span class="bad">CF = 40 is the median — not a quartile</span>`,
};

const SECONDARY_CARD_FOUNDATION = {
  topic: "Foundation · Ratio",
  title: "Inverse proportion — more workers, fewer days",
  citations: "Paper 1F · Q14 · 2023",
  question: "<b>5 machines</b> take <b>18 days</b> to complete a job. How long would <b>9 machines</b> take?",
  mistake: "Students write <strong>9 / 5 × 18 = 32.4 days</strong>. More machines should mean <em>fewer</em> days — the answer has to be less than 18.",
  method: "Find the constant total of machine-days: 5 × 18 = 90. The job takes 90 machine-days no matter how many you have. Divide by the new headcount.",
  answer: `total = 5 × 18 = 90 machine-days

time for 9 machines
  = 90 ÷ 9
  = <span class="good">10 days</span>

sense check: 10 < 18  ✓
(more machines → fewer days)`,
};

const HEADLINES = {
  exact: {
    main: "The exact mistakes <em>Edexcel examiners</em> are watching for.",
    sub: "A free PDF of the specific slip-ups called out in every Edexcel GCSE Maths examiner's report, organised by topic. Every card has four parts:",
    list: ["Example question", "The common mistake", "The correct method", "Worked answer"]
  },
  patterns: {
    main: "The <em>patterns</em> costing you marks in GCSE Maths.",
    sub: "Examiners publish a report every year naming the exact mistakes students make. We read all of them and pulled the patterns. Every card has four parts:",
    list: ["Example question", "The common mistake", "The correct method", "Worked answer"]
  },
  wrong: {
    main: "Here's what Edexcel <em>already know</em> you'll get wrong.",
    sub: "Every year, examiners publish a report listing the specific mistakes students made. Almost no student reads them. Each of the 58 cards in the PDF has four parts:",
    list: ["Example question", "The common mistake", "The correct method", "Worked answer"]
  }
};

const SPEC = {
  higher: [
    { topic: "Number", weight: 15 },
    { topic: "Algebra", weight: 30 },
    { topic: "Ratio, proportion & rates", weight: 20 },
    { topic: "Geometry & measures", weight: 20 },
    { topic: "Probability", weight: 7.5 },
    { topic: "Statistics", weight: 7.5 },
  ],
  foundation: [
    { topic: "Number", weight: 25 },
    { topic: "Algebra", weight: 20 },
    { topic: "Ratio, proportion & rates", weight: 25 },
    { topic: "Geometry & measures", weight: 15 },
    { topic: "Probability", weight: 7.5 },
    { topic: "Statistics", weight: 7.5 },
  ],
};

Object.assign(window, {
  HIGHER_CARD, FOUNDATION_CARD,
  SECONDARY_CARD_HIGHER, SECONDARY_CARD_FOUNDATION,
  HEADLINES,
  SPEC,
});
