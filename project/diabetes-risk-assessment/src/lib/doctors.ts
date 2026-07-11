import { Doctor } from '../types';

/**
 * Chanzo kimoja cha taarifa za madaktari — kinatumiwa na DoctorPage.tsx
 * na pia na chatbot (lib/chatbot.ts) ili majibu ya bot yaendane na
 * kile kinachoonyeshwa kwenye ukurasa wa "Wasiliana na Daktari".
 */
export const DOCTORS: Doctor[] = [
  { name: 'Dkt. Amina Mwakalinga', specialty: 'Mtaalamu wa Kisukari (Endocrinologist)', phone: '+255 754 112 233', email: 'amina.mwakalinga@afya.co.tz' },
  { name: 'Dkt. Juma Kessy', specialty: 'Daktari wa Magonjwa ya Ndani', phone: '+255 767 445 890', email: 'juma.kessy@afya.co.tz' },
  { name: 'Dkt. Grace Mmasi', specialty: 'Mtaalamu wa Lishe na Kisukari', phone: '+255 712 998 001', email: 'grace.mmasi@afya.co.tz' },
  { name: 'Dkt. Peter Shirima', specialty: 'Daktari Bingwa wa Moyo', phone: '+255 789 221 456', email: 'peter.shirima@afya.co.tz' },
  { name: 'Dkt. Fatuma Rajabu', specialty: 'Daktari wa Familia', phone: '+255 715 330 771', email: 'fatuma.rajabu@afya.co.tz' },
];
