import { auth } from './auth';
import { storage } from './storage';
import { DOCTORS } from './doctors';

export interface BotAction {
  label: string;
  to: string;
}

export interface BotReply {
  text: string;
  action?: BotAction;
}

interface Intent {
  id: string;
  keywords: string[];
  handler: () => BotReply;
}

function doctorListText(): string {
  return DOCTORS.map((d) => `• ${d.name} — ${d.specialty} (📞 ${d.phone})`).join('\n');
}

/**
 * Kila intent ina keywords za Kiswahili (na baadhi ya Kiingereza) zinazolingana
 * na maswali ya kawaida ya watumiaji. Majibu yanajengwa kutoka kwenye data
 * halisi ya mfumo (DOCTORS, hali ya sasa ya mtumiaji) badala ya maandishi
 * yaliyobuniwa, ili bot "isome mfumo" kikweli.
 */
function buildIntents(): Intent[] {
  return [
    {
      id: 'contact-doctor',
      keywords: [
        'daktari', 'wasiliana', 'ongea na daktari', 'muuguzi', 'ushauri', 'miadi',
        'appointment', 'contact doctor', 'talk to doctor', 'nataka daktari', 'doctor',
      ],
      handler: () => {
        const user = auth.currentUser();
        const hasAssessment = user ? storage.assessmentsForUser(user.id).length > 0 : false;

        const steps = hasAssessment
          ? 'Nenda kwenye ukurasa wa "Wasiliana na Daktari" (kwenye menyu ya kando), chagua daktari unayemtaka, kisha bofya "Tuma Ombi la Ushauri". Andika ujumbe wako kwa ufupi na utume. Ripoti yako ya tathmini ya karibuni itaambatanishwa moja kwa moja — huhitaji kuipakia mwenyewe.'
          : 'Kwanza fanya "Tathmini" moja na uihifadhi (ukurasa wa Fanya Tathmini). Baada ya hapo nenda kwenye "Wasiliana na Daktari" — mfumo utaambatanisha ripoti yako ya karibuni moja kwa moja kwenye ombi lako kwa daktari.';

        return {
          text: `Unaweza kuwasiliana na daktari moja kwa moja ndani ya mfumo:\n\n${steps}\n\nMadaktari waliopo kwa sasa:\n${doctorListText()}`,
          action: { label: 'Fungua Wasiliana na Daktari', to: '/doctor' },
        };
      },
    },
    {
      id: 'assessment',
      keywords: [
        'tathmini', 'assessment', 'fomu', 'maswali ya tathmini', 'bmi', 'glucose',
        'sukari', 'jinsi tathmini', 'jinsi ya kufanya tathmini', 'hatari',
      ],
      handler: () => ({
        text: 'Tathmini inakuuliza taarifa 12 za kiafya (umri, jinsia, BMI, sukari ya damu, shinikizo la damu, cholesterol, historia ya ugonjwa wa moyo, hypertension, uvutaji sigara, unywaji pombe, kiwango cha mazoezi, na muda wa kulala). Mfumo hukokotoa alama (score) na kukupa kiwango cha hatari — Ndogo, Wastani, au Juu — pamoja na sababu kuu zilizoongeza hatari na mapendekezo ya kiafya.',
        action: { label: 'Fanya Tathmini', to: '/assessment' },
      }),
    },
    {
      id: 'report',
      keywords: ['pdf', 'csv', 'ripoti', 'pakua', 'download', 'report', 'chapisha'],
      handler: () => ({
        text: 'Baada ya kupata matokeo ya tathmini, unaweza kupakua ripoti yako kwa umbo la CSV (inafunguka vizuri Excel/Google Sheets) au PDF (tayari kwa kuchapisha au kutuma). Vitufe vya kupakua vipo kwenye ukurasa wa Matokeo, na pia kwenye Historia kwa kila tathmini uliyowahi kufanya.',
        action: { label: 'Angalia Historia', to: '/history' },
      }),
    },
    {
      id: 'history',
      keywords: ['historia', 'history', 'tathmini za nyuma', 'rekodi'],
      handler: () => ({
        text: 'Ukurasa wa Historia unaonyesha tathmini zako zote ulizowahi kufanya na kuhifadhi — kila moja ikiwa na tarehe, kiwango cha hatari, na uwezekano wa kupakua ripoti yake (CSV/PDF).',
        action: { label: 'Fungua Historia', to: '/history' },
      }),
    },
    {
      id: 'account',
      keywords: ['akaunti', 'nenosiri', 'password', 'sajili', 'ingia', 'login', 'register', 'usajili', 'account'],
      handler: () => ({
        text: 'Unaweza kujisajili kwa jina, barua pepe, simu, jinsia, umri, na nenosiri. Taarifa hizi kwa sasa zinahifadhiwa kwenye kivinjari chako pekee (localStorage), si kwenye seva ya nje. Ukisahau nenosiri, mfumo huu bado hauna njia ya "reset" ya moja kwa moja.',
      }),
    },
    {
      id: 'greeting',
      keywords: ['habari', 'mambo', 'hujambo', 'hello', 'hi', 'niaje', 'shikamoo', 'vipi'],
      handler: () => ({
        text: 'Habari! Mimi ni msaidizi wa AfyaTathmini. Ninaweza kukusaidia kuhusu: kufanya tathmini, kuelewa matokeo yako, kupakua ripoti, kuangalia historia, au kuwasiliana na daktari. Niulize chochote!',
      }),
    },
  ];
}

function scoreIntent(message: string, intent: Intent): number {
  const lower = message.toLowerCase();
  return intent.keywords.reduce((score, kw) => (lower.includes(kw.toLowerCase()) ? score + 1 : score), 0);
}

export function getBotReply(message: string): BotReply {
  const intents = buildIntents();
  let best: { intent: Intent; score: number } | null = null;

  for (const intent of intents) {
    const score = scoreIntent(message, intent);
    if (score > 0 && (!best || score > best.score)) {
      best = { intent, score };
    }
  }

  if (best) return best.intent.handler();

  return {
    text: 'Samahani, sijaelewa vizuri swali lako. Unaweza kuniuliza kuhusu: kufanya tathmini, kuelewa matokeo/hatari, kupakua ripoti (CSV/PDF), historia yako, au jinsi ya kuwasiliana na daktari.',
  };
}

export const QUICK_SUGGESTIONS = [
  'Nawezaje kuwasiliana na daktari?',
  'Tathmini inafanyaje kazi?',
  'Nawezaje kupakua ripoti yangu?',
];
