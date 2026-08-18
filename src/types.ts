export type AppStep = 'form' | 'roulette' | 'result';

export type MellstroyRarity = 'Обычный' | 'Редкий' | 'Эпический' | 'Легендарный' | 'Мифический';

export interface Mellstroy {
  id: number;
  numberStr: string;
  name: string;
  shortTitle: string;
  image: string;
  video: string;
  description: string;
  quote: string;
  rarity: MellstroyRarity;
  hype: number;
  energy: number;
  luck: number;
  accentColor: string;
  gradient: string;
  badge: string;
}
