import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

export interface TarotCard {
  name: string;
  position: 'past' | 'present' | 'future';
  reversed?: boolean;
}

export interface TarotAnalysisInput {
  mbti: string;
  category: string;
  cards: TarotCard[];
}

export const analyzeTarotWithOpenAI = async (input: TarotAnalysisInput): Promise<string> => {
  const { mbti, category, cards } = input;

  const cardDescriptions = cards
    .map((c) => `- ${c.position.toUpperCase()}: ${c.name}${c.reversed ? ' (역방향)' : ''}`)
    .join('\n');

  const prompt = `
당신은 타로 카드 전문 해석가입니다. 다음 정보를 바탕으로 깊이 있고 개인화된 타로 해석을 한국어로 작성해주세요.

[사용자 정보]
- MBTI: ${mbti}
- 질문 주제: ${category}

[선택된 카드]
${cardDescriptions}

[해석 지침]
1. MBTI 성향(${mbti})을 고려한 해석을 제공하세요.
2. 과거-현재-미래 카드의 흐름을 연결하여 스토리를 만들어주세요.
3. 역방향 카드가 있다면 그 의미를 반영하세요.
4. 실질적이고 행동 가능한 조언으로 마무리하세요.
5. 전체 300~400자 이내로 간결하게 작성하세요.
`.trim();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
  });

  return response.choices[0]?.message.content ?? '';
};
