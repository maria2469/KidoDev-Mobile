import { supabase } from './supabaseClient';

export interface GradeResult {
  score: number;
  xpEarned: number;
  stars: number;
  badge: 'Gold Medal' | 'Silver Medal' | 'Bronze Medal' | 'Target Participant';
  feedback: string;
  isPassed: boolean;
  missingTypes: string[];
  wrongBlocks: string[];
}

export const RANKS = [
  { name: 'Bronze', minXp: 0 },
  { name: 'Silver', minXp: 200 },
  { name: 'Gold', minXp: 500 },
  { name: 'Platinum', minXp: 1000 },
  { name: 'Diamond', minXp: 2000 },
];

export function getLevelFromXp(totalXp: number): string {
  let current = RANKS[0].name;
  for (const lvl of RANKS) {
    if (totalXp >= lvl.minXp) current = lvl.name;
  }
  return current;
}

export function getProjectBadge(score: number): {
  badge: 'Gold Medal' | 'Silver Medal' | 'Bronze Medal' | 'Target Participant';
  stars: number;
  color: string;
} {
  if (score >= 90) return { badge: 'Gold Medal', stars: 3, color: '#FFD000' };
  if (score >= 70) return { badge: 'Silver Medal', stars: 2, color: '#B0B8C8' };
  if (score >= 40) return { badge: 'Bronze Medal', stars: 1, color: '#D4845A' };
  return { badge: 'Target Participant', stars: 0, color: '#94A3B8' };
}

export function calculateXp(score: number): number {
  if (score === 100) return 10;
  if (score >= 80) return 8;
  if (score >= 60) return 6;
  if (score >= 40) return 4;
  return 0;
}

// Built-in solution cache for instant offline verification and matching
const BUILT_IN_SOLUTIONS: Record<string, string> = {
  L1P1: '<xml><block type="s_when_flag"><next><block type="s_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">200</field></shadow></value></block></next></block></xml>',
  L1P2: '<xml><block type="s_when_flag"><next><block type="s_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value><next><block type="s_change_y"><value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value></block></next></block></next></block></xml>',
  L1P3: '<xml><block type="s_when_flag"><next><block type="s_change_y"><value name="Y"><shadow type="math_number"><field name="NUM">100</field></shadow></value><next><block type="s_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></next></block></next></block></xml>',
  L1P4: '<xml><block type="s_when_flag"><next><block type="s_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value><next><block type="s_change_y"><value name="Y"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></next></block></next></block></xml>',
  L1P5: '<xml><block type="s_when_flag"><next><block type="s_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="s_change_y"><value name="Y"><shadow type="math_number"><field name="NUM">40</field></shadow></value></block></next></block></next></block></xml>',
};

const HAT_BLOCKS = [
  's_when_flag',
  'event_whenflagclicked',
  's_when_clicked',
  'event_whenthisspriteclicked',
  's_when_key',
];

/**
 * Normalizes Scratch & Blockly block types to a unified comparison key
 */
function normalizeType(type: string): string {
  if (!type) return '';
  const t = type.toLowerCase().trim();
  if (t === 'event_whenflagclicked' || t === 's_when_flag') return 's_when_flag';
  if (t === 'event_whenthisspriteclicked' || t === 's_when_clicked') return 's_when_clicked';
  if (t === 'motion_movesteps' || t === 's_move') return 's_move';
  if (t === 'motion_turnright' || t === 's_turn_r') return 's_turn_r';
  if (t === 'motion_turnleft' || t === 's_turn_l') return 's_turn_l';
  if (t === 'looks_sayforsecs' || t === 'looks_say' || t === 's_say') return 's_say';
  if (t === 'sound_playuntildone' || t === 's_play_sound') return 's_play_sound';
  if (t === 'control_repeat' || t === 's_repeat') return 's_repeat';
  if (t === 'control_wait' || t === 's_wait') return 's_wait';
  return t;
}

/**
 * Parses XML string to extract blocks and fields
 */
function extractBlocksFromXml(xml: string): { type: string; fields: Record<string, any> }[] {
  const blocks: { type: string; fields: Record<string, any> }[] = [];
  const blockRegex = /<block\s+type="([^"]+)"[^>]*>([\s\S]*?)<\/block>/gi;
  let match;
  while ((match = blockRegex.exec(xml)) !== null) {
    const rawType = match[1];
    if (rawType === 'math_number' || rawType === 'text') continue;

    const inner = match[2];
    const fields: Record<string, any> = {};

    const fieldRegex = /<field\s+name="([^"]+)">([^<]+)<\/field>/gi;
    let fMatch;
    while ((fMatch = fieldRegex.exec(inner)) !== null) {
      fields[fMatch[1]] = fMatch[2].trim();
    }

    blocks.push({ type: normalizeType(rawType), fields });
  }
  return blocks;
}

/**
 * Evaluates student code with the exact criteria and scoring system of the web version
 */
export async function evaluateCode(
  lessonId: string,
  studentBlocks: { type: string; fields?: Record<string, any> }[],
  studentXml?: string
): Promise<GradeResult> {
  const normalizedStudent = studentBlocks.map((b) => ({
    type: normalizeType(b.type),
    fields: b.fields || {},
  }));

  const studentBlockTypes = normalizedStudent.map((b) => b.type);

  // If workspace is completely empty
  if (studentBlockTypes.length === 0) {
    return {
      score: 0,
      xpEarned: 0,
      stars: 0,
      badge: 'Target Participant',
      feedback: 'Your workspace is empty! Drag and snap blocks to start your quest.',
      isPassed: false,
      missingTypes: [],
      wrongBlocks: [],
    };
  }

  // 1. Fetch solution XML (cache / Supabase)
  let solutionXml = BUILT_IN_SOLUTIONS[lessonId];
  if (!solutionXml) {
    try {
      const { data } = await supabase
        .from('tutor_solutions')
        .select('xml')
        .eq('lesson_id', lessonId)
        .maybeSingle();
      if (data?.xml) solutionXml = data.xml;
    } catch (e) {
      // offline fallback
    }
  }

  // Fallback grading if no specific solution exists in database
  if (!solutionXml) {
    const hasHat = studentBlockTypes.some((b) => HAT_BLOCKS.includes(b));
    let score = Math.min(100, studentBlockTypes.length * 20 + (hasHat ? 10 : 0));
    const xpEarned = calculateXp(score);
    const { badge, stars } = getProjectBadge(score);

    return {
      score,
      xpEarned,
      stars,
      badge,
      feedback: score >= 60 ? 'Great job! Your code works well.' : 'Try connecting more blocks.',
      isPassed: score >= 40,
      missingTypes: [],
      wrongBlocks: [],
    };
  }

  // 2. Exact Web Matching Algorithm
  const solutionBlocks = extractBlocksFromXml(solutionXml);
  const requiredBlocks = solutionBlocks.filter((b) => !HAT_BLOCKS.includes(b.type));
  const requiredTypes = [...new Set(requiredBlocks.map((b) => b.type))];

  // Identify wrong / extra blocks
  const wrongBlocks = studentBlockTypes.filter(
    (type) => !requiredTypes.includes(type) && !HAT_BLOCKS.includes(type)
  );

  let totalScorePoints = 0;
  const maxScorePoints = Math.max(1, requiredBlocks.length);
  const missingTypes: string[] = [];

  requiredBlocks.forEach((req) => {
    const match = normalizedStudent.find((sb) => sb.type === req.type);
    if (match) {
      let blockCredit = 1.0;

      // Check fields matching (e.g. STEPS = 200, Y = 80)
      if (req.fields && Object.keys(req.fields).length > 0) {
        let fieldMatches = 0;
        let fieldTotal = 0;
        for (const [fname, fval] of Object.entries(req.fields)) {
          fieldTotal++;
          if (match.fields && String(match.fields[fname]) === String(fval)) {
            fieldMatches++;
          }
        }
        if (fieldTotal > 0) {
          const fieldAccuracy = fieldMatches / fieldTotal;
          // If block settings are wrong, give 70% credit
          blockCredit *= 0.7 + 0.3 * fieldAccuracy;
        }
      }

      totalScorePoints += blockCredit;
    } else {
      if (!missingTypes.includes(req.type)) {
        missingTypes.push(req.type);
      }
    }
  });

  const hasHat = studentBlockTypes.some((b) => HAT_BLOCKS.includes(b));
  const hasRequiredHat = solutionBlocks.some((b) => HAT_BLOCKS.includes(b.type));

  let rawScore = (totalScorePoints / maxScorePoints) * 100;

  // Bonus for event hat block
  if (hasRequiredHat && hasHat) {
    rawScore += 5;
  } else if (hasRequiredHat && !hasHat) {
    rawScore -= 10;
  }

  // Penalty for wrong blocks
  if (wrongBlocks.length > 0) {
    rawScore -= wrongBlocks.length * 12;
  }

  // Perfect 100 bonus ONLY if 0 missing, 0 wrong, and 100% field accuracy
  const is100PercentPerfect =
    missingTypes.length === 0 && wrongBlocks.length === 0 && totalScorePoints >= maxScorePoints;

  const score = is100PercentPerfect ? 100 : Math.max(0, Math.min(95, Math.round(rawScore)));

  // XP calculation
  const xpEarned = calculateXp(score);
  const { badge, stars } = getProjectBadge(score);

  let feedback = 'Quest Complete! You mastered this challenge!';
  if (score === 100) {
    feedback = 'Perfect 100% Solution! Whiskers completed the mission flawlessly!';
  } else if (score >= 80) {
    feedback = 'Fantastic job! You earned a Gold score!';
  } else if (score >= 60) {
    feedback = 'Good work! You are on the right track.';
  } else if (missingTypes.length > 0) {
    feedback = `You are missing ${missingTypes.length} required block(s). Add them and try again!`;
  } else {
    feedback = 'Check your block numbers and directions, then try again!';
  }

  return {
    score,
    xpEarned,
    stars,
    badge,
    feedback,
    isPassed: score >= 40,
    missingTypes,
    wrongBlocks,
  };
}

/**
 * Saves completion to Supabase database (lesson_completions and child_profiles)
 */
export async function saveProgress({
  childId,
  lessonId,
  score,
  badge,
  xpEarned,
}: {
  childId?: string;
  lessonId: string;
  score: number;
  badge: string;
  xpEarned: number;
}) {
  if (!childId) return;

  try {
    // 1. Fetch existing completion
    const { data: existingComp } = await supabase
      .from('lesson_completions')
      .select('id, score')
      .eq('child_id', childId)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (!existingComp) {
      await supabase.from('lesson_completions').insert([
        {
          child_id: childId,
          lesson_id: lessonId,
          score,
          badge,
        },
      ]);
    } else if (score > (existingComp.score || 0)) {
      await supabase
        .from('lesson_completions')
        .update({
          score,
          badge,
        })
        .eq('id', existingComp.id);
    }

    // 2. Update child_profile XP & Level
    const { data: profile } = await supabase
      .from('child_profiles')
      .select('total_xp, level')
      .eq('id', childId)
      .maybeSingle();

    if (profile) {
      const prevXp = profile.total_xp || 0;
      const newTotalXp = prevXp + xpEarned;
      const newLevel = getLevelFromXp(newTotalXp);

      await supabase
        .from('child_profiles')
        .update({
          total_xp: newTotalXp,
          level: newLevel,
        })
        .eq('id', childId);
    }
  } catch (err) {
    console.warn('[saveProgress] error:', err);
  }
}
