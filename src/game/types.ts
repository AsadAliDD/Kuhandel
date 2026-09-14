export const ANIMALS = [
  { id: 'horse', name: 'Horse', emoji: '🐎', value: 1000 }, { id: 'cow', name: 'Cow', emoji: '🐄', value: 800 },
  { id: 'pig', name: 'Pig', emoji: '🐖', value: 650 }, { id: 'goat', name: 'Goat', emoji: '🐐', value: 500 },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', value: 350 }, { id: 'donkey', name: 'Donkey', emoji: '🫏', value: 250 },
  { id: 'dog', name: 'Dog', emoji: '🐕', value: 160 }, { id: 'cat', name: 'Cat', emoji: '🐈', value: 90 },
] as const;
export type AnimalId = typeof ANIMALS[number]['id']; export type Money = 0 | 10 | 20 | 50 | 100 | 200 | 500;
export interface AnimalCard { uid: string; animal: AnimalId; value: number }
export interface Player { id: string; name: string; money: Money[]; animals: AnimalCard[] }
export type Phase = 'setup' | 'choose' | 'auction' | 'trade' | 'finished';
export interface Auction { card: AnimalCard; bids: Record<string, number>; highestBid: number; highestBidder?: string }
export interface Trade { initiator: string; opponent: string; animal: AnimalId; offer: Money[]; response?: Money[] }
export interface HistoryEntry { id: string; text: string; tone?: 'auction' | 'trade' | 'turn' }
export interface GameState { version: 1; players: Player[]; deck: AnimalCard[]; currentPlayer: number; phase: Phase; auction?: Auction; trade?: Trade; history: HistoryEntry[]; winnerIds: string[]; turn: number }
export type GameAction = { type:'RESTORE'; state:GameState } | { type:'START'; names:string[]; seed?:number } | { type:'DRAW_AUCTION' } | { type:'BID'; playerId:string; amount:number } | { type:'RESOLVE_AUCTION' } | { type:'START_TRADE'; opponentId:string; animal:AnimalId; offer:Money[] } | { type:'RESPOND_TRADE'; response:Money[] } | { type:'RESOLVE_TRADE'; choice:'accept'|'counter' } | { type:'END_TURN' };
