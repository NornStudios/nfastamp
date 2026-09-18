/**
 * NFA Slogan Generator
 * Random disclaimers and taglines for maximum meme energy
 */

export const SLOGANS = [
  "You could have bought actual stamps.",
  "This is not financial advice, it's barely advice.",
  "The only guaranteed return is the homepage.",
  "DYOR, then DYOR your DYOR.",
  "Stamp it. Regret it. Repeat.",
  "House always wins. We put it on the receipt.",
  "Your portfolio called. It's crying.",
  "NFA: Because 'trust me bro' needed a mascot.",
  "Lose money with style.",
  "The official coin of poor decisions.",
  "At least the logo is cute.",
  "Making disclaimers fun since 2026.",
  "We're not saying it's a good idea.",
  "The only coin honest about being a bad investment.",
  "Gamble responsibly. Or don't. NFA.",
  "When the disclaimer IS the product.",
  "100% organic copium.",
  "Better odds than your ex texting back.",
  "Certified fresh (losses).",
  "The fastest way to turn money into memories.",
  "Brought to you by bad decisions™",
  "For entertainment purposes only. Very entertaining.",
  "The coin that admits it.",
  "Probably nothing. Definitely something.",
  "Wen lambo? Never lambo.",
  "Built different. Loses the same.",
  "Not financial advice. That's the whole point.",
  "Your mom said no.",
  "Have you tried buying high and selling low?",
  "The chart goes right, eventually.",
  "Stampy believes in you. Stampy is wrong.",
  "It's called a 'learning experience' now.",
  "Past performance is not indicative of... anything.",
  "May contain traces of hopium.",
  "Side effects include: chart checking, cope posting.",
  "The house edge is the only edge we have.",
  "At least it's not a rug. It's a stamp.",
  "Ink dries. So do portfolios.",
  "We stan financial illiteracy.",
  "Press F to pay respects (and chips).",
] as const

export function getRandomSlogan(): string {
  return SLOGANS[Math.floor(Math.random() * SLOGANS.length)]
}

export function getRandomSlogans(count: number): string[] {
  const shuffled = [...SLOGANS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const DISCLAIMER_MADLIBS = [
  {
    template: "This [NOUN] is not [ADJECTIVE] advice. It's [ADJECTIVE] [NOUN].",
    nouns: ['token', 'stamp', 'meme', 'coin', 'investment', 'jpeg'],
    adjectives: ['financial', 'good', 'smart', 'legal', 'professional', 'sane'],
  },
  {
    template: "Always [VERB] before you [VERB]. NFA.",
    verbs: ['DYOR', 'panic', 'sell', 'cry', 'screenshot', 'regret'],
  },
  {
    template: "If you [VERB], you might [VERB]. That's on you.",
    verbs: ['buy', 'hold', 'sell', 'ape in', 'fomo', 'paper hand'],
  },
] as const

export function generateMadlib(): string {
  const template = DISCLAIMER_MADLIBS[Math.floor(Math.random() * DISCLAIMER_MADLIBS.length)]
  let result = template.template

  if ('nouns' in template) {
    const noun1 = template.nouns[Math.floor(Math.random() * template.nouns.length)]
    const noun2 = template.nouns[Math.floor(Math.random() * template.nouns.length)]
    const adj1 = template.adjectives[Math.floor(Math.random() * template.adjectives.length)]
    const adj2 = template.adjectives[Math.floor(Math.random() * template.adjectives.length)]
    result = result.replace('[NOUN]', noun1).replace('[NOUN]', noun2)
    result = result.replace('[ADJECTIVE]', adj1).replace('[ADJECTIVE]', adj2)
  }

  if ('verbs' in template) {
    const verbs = [...template.verbs].sort(() => Math.random() - 0.5)
    result = result.replace('[VERB]', verbs[0]).replace('[VERB]', verbs[1])
  }

  return result
}

export const WIN_QUIPS = [
  "Even a broken clock... wait, you actually won?",
  "Stampy is impressed. Stampy is rarely impressed.",
  "Screenshot this. It won't happen again.",
  "The prophecy was true!",
  "Don't let it go to your head.",
  "Quick, quit while you're ahead!",
  "A winner? In THIS economy?",
  "Beginner's luck. Definitely.",
  "The algorithm smiled upon you.",
  "NFA, but nice.",
] as const

export const LOSE_QUIPS = [
  "There it is.",
  "Stampy saw that coming.",
  "The house thanks you for your donation.",
  "This is why we have disclaimers.",
  "It's called 'redistribution of wealth.'",
  "The edge was never in your favor.",
  "At least you're consistent.",
  "Have you considered... not?",
  "Thank you for your service.",
  "Pain is just weakness leaving the wallet.",
] as const

export function getWinQuip(): string {
  return WIN_QUIPS[Math.floor(Math.random() * WIN_QUIPS.length)]
}

export function getLoseQuip(): string {
  return LOSE_QUIPS[Math.floor(Math.random() * LOSE_QUIPS.length)]
}
