import { Member, Practice, PracticeSelection, PDFGenerationOptions } from './types';

/**
 * Generate a single personalized plan PDF.
 * Takes member data + selected practices → PDF Buffer
 *
 * Pure function: no database access, no side effects.
 */
export async function generatePlanPDF(
  member: Member,
  selections: PracticeSelection[],
  practices: Practice[],
  options?: PDFGenerationOptions
): Promise<Buffer> {
  // Validate input
  if (selections.length !== 5) {
    throw new Error(`Expected 5 practices, got ${selections.length}`);
  }

  // Build HTML from template
  const html = buildPlanHTML(member, selections, practices, options);

  // In browser environment, this would use html2pdf or similar
  // On server, use puppeteer
  // For now, return placeholder
  return Buffer.from(html);
}

/**
 * Generate PDFs for multiple members in parallel.
 * Returns array of { memberId, pdf: Buffer }
 */
export async function generatePlansBulk(
  members: Member[],
  getSelectionsAndPractices: (memberId: string) => {
    selections: PracticeSelection[];
    practices: Practice[];
  },
  options?: PDFGenerationOptions
): Promise<{ memberId: string; pdf: Buffer }[]> {
  const results: { memberId: string; pdf: Buffer }[] = [];

  for (const member of members) {
    try {
      const { selections, practices } = getSelectionsAndPractices(member.id);
      const pdf = await generatePlanPDF(member, selections, practices, options);
      results.push({ memberId: member.id, pdf });
    } catch (error) {
      console.error(`Failed to generate PDF for member ${member.id}:`, error);
      // Continue with other members
    }
  }

  return results;
}

/**
 * Build the HTML structure from plan data.
 * This HTML can be rendered to PDF using puppeteer (server) or html2pdf (client).
 */
function buildPlanHTML(
  member: Member,
  selections: PracticeSelection[],
  practices: Practice[],
  options?: PDFGenerationOptions
): string {
  const pillarLabels = {
    sleep: 'GoodSleep',
    eat: 'GoodEat',
    move: 'GoodMove',
    mind: 'GoodMind',
  };

  const pillarColors = {
    sleep: '#4B7BA7',
    eat: '#8BC34A',
    move: '#FF9800',
    mind: '#9C27B0',
  };

  const pillarColor = pillarColors[member.pillar];
  const pillarLabel = pillarLabels[member.pillar];

  // Collect all references from selected practices
  const uniqueReferences = new Set<string>();
  practices.forEach((p) => {
    p.references.forEach((ref) => uniqueReferences.add(ref));
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pillarLabel} Personalised Plan - ${member.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }

    .page { page-break-after: always; padding: 40px; min-height: 297mm; }
    .page:last-child { page-break-after: avoid; }

    /* PAGE 1: COVER */
    .page-cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, ${pillarColor} 0%, ${pillarColor}dd 100%);
      color: white;
    }

    .pillar-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 40px;
    }

    .days-label {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 20px;
      letter-spacing: 2px;
    }

    .plan-title {
      font-size: 36px;
      font-weight: 300;
      margin-bottom: 60px;
    }

    .personalization {
      font-size: 28px;
      font-weight: 400;
      margin-bottom: 40px;
      background: rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 8px;
    }

    /* SECTIONS */
    .section-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
      color: ${pillarColor};
    }

    .section-number {
      display: inline-block;
      background: ${pillarColor};
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      font-weight: 700;
      margin-right: 12px;
    }

    .section-content {
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 40px;
    }

    /* PRACTICE CARD */
    .practice-card {
      page-break-inside: avoid;
      margin-bottom: 40px;
      padding: 24px;
      border-left: 4px solid ${pillarColor};
      background: #f9f9f9;
    }

    .practice-number {
      display: inline-block;
      font-size: 24px;
      font-weight: 700;
      color: ${pillarColor};
      margin-right: 12px;
    }

    .practice-category {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      background: ${pillarColor};
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .practice-text {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .start-with-this {
      display: inline-block;
      background: #FFD54F;
      color: #333;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .practice-instructions {
      font-size: 15px;
      line-height: 1.7;
      color: #555;
      margin-bottom: 16px;
    }

    .practice-instructions ul {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    .practice-instructions li {
      margin-bottom: 8px;
    }

    .practice-research {
      font-size: 14px;
      line-height: 1.6;
      color: #666;
      font-style: italic;
      padding-top: 12px;
      border-top: 1px solid #ddd;
    }

    /* REFERENCES */
    .references {
      margin-top: 40px;
      padding-top: 40px;
      border-top: 2px solid ${pillarColor};
    }

    .reference-item {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .doi-link {
      color: ${pillarColor};
      text-decoration: none;
    }

    /* FOOTER */
    .page-footer {
      position: fixed;
      bottom: 20px;
      right: 40px;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page page-cover">
  <div class="pillar-badge">${pillarLabel}</div>
  <div class="days-label">30 DAYS</div>
  <div class="plan-title">Personalised Longevity Plan</div>
  <div class="personalization">Hi ${member.name},</div>
</div>

<!-- PAGE 2: YOUR STARTING POINT -->
<div class="page">
  <h2 class="section-title">
    <span class="section-number">1</span>Your Starting Point
  </h2>
  <div class="section-content">
    ${options?.customIntro || `
      You're starting a 30-day journey focused on ${pillarLabel}.
      This personalized plan has been created based on your assessment responses
      and is designed to help you build sustainable longevity habits.
    `}
  </div>
</div>

<!-- PAGE 3: YOUR LONGEVITY PILLAR -->
<div class="page">
  <h2 class="section-title">
    <span class="section-number">2</span>Your Longevity Pillar: ${pillarLabel}
  </h2>
  <div class="section-content">
    ${options?.customPillarDescription || `
      ${pillarLabel} is one of the four pillars of longevity. This pillar encompasses
      practices and habits that support sustainable health and wellbeing in this domain.
      The practices selected for you are designed to fit your lifestyle and goals.
    `}
  </div>
</div>

<!-- PAGE 4-5: PRACTICES -->
<div class="page">
  <h2 class="section-title">
    <span class="section-number">3</span>Your Personalised Practices
  </h2>

  ${selections
    .map((sel) => {
      const practice = practices.find((p) => p.text === sel.practiceText && p.category === sel.category);
      if (!practice) return '';

      return `
      <div class="practice-card">
        <div>
          <span class="practice-number">${sel.position}</span>
          <span class="practice-category">${practice.category.toUpperCase()}</span>
        </div>
        ${sel.isStartWithThis ? '<div class="start-with-this">RECOMMENDED STARTING POINT</div>' : ''}
        <div class="practice-text">${practice.text}</div>
        <div class="practice-instructions">
          <strong>How to practice:</strong><br/>
          ${practice.why}
        </div>
        <div class="practice-research">
          <strong>Research:</strong> ${practice.evidence}
        </div>
      </div>
      `;
    })
    .join('')}
</div>

<!-- PAGE 6: MAKE IT YOURS -->
<div class="page">
  <h2 class="section-title">
    <span class="section-number">4</span>Make It Yours
  </h2>
  <div class="section-content">
    <p>These practices are starting points. You have complete flexibility to adapt them to your lifestyle:</p>
    <ul style="margin-left: 24px; margin-top: 16px;">
      <li><strong>Timing:</strong> Choose when during the day works best for you</li>
      <li><strong>Frequency:</strong> Start where you feel comfortable and build gradually</li>
      <li><strong>Adaptation:</strong> Modify practices to fit your circumstances</li>
      <li><strong>Swapping:</strong> If a practice doesn't resonate, let us know for alternatives</li>
    </ul>
  </div>
</div>

<!-- PAGE 7: WHAT HAPPENS NEXT -->
<div class="page">
  <h2 class="section-title">
    <span class="section-number">5</span>What Happens Next
  </h2>
  <div class="section-content">
    Over the next 30 days, you'll have the opportunity to integrate these practices into your routine.
    At the end of the span, we'll collect your feedback on the experience, what worked,
    and how we can refine your next personalized plan.
  </div>
</div>

<!-- PAGE 8: BEFORE YOU BEGIN -->
<div class="page">
  <h2 class="section-title">
    <span class="section-number">6</span>Before You Begin
  </h2>
  <div class="section-content">
    <p><strong>Consistency over perfection:</strong> Small, consistent actions compound over time.</p>
    <p><strong>Listen to your body:</strong> These practices are suggestions. Honor your own needs and boundaries.</p>
    <p><strong>Support:</strong> You're part of a circle of people on the same journey. Reach out to your circle for accountability and connection.</p>
  </div>
</div>

<!-- FINAL: RESEARCH & REFERENCES -->
<div class="page">
  <h2 class="section-title">
    <span class="section-number">7</span>The Research Behind Your Practices
  </h2>

  <div class="section-content">
    <p>Each practice in your plan is grounded in research on longevity and wellbeing.
    Below are the key sources and evidence supporting your personalized practices.</p>
  </div>

  <div class="references">
    ${Array.from(uniqueReferences)
      .map((ref) => `<div class="reference-item">${ref}</div>`)
      .join('')}
  </div>
</div>

<div class="page-footer">Generated on ${new Date().toLocaleDateString()} | GoodSpan</div>

</body>
</html>
  `;
}
