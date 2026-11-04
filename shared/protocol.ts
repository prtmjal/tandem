// Messages and views shared by the server and the phones.
import type { Card } from './content';

/** Stored on each phone once that person confirms they are 18+. Bump to ask everyone again. */
export const AGE_OK = 'v2';

/** Every create/join must carry the person's own 18+ confirmation, or the server refuses it. */
export const isAdultAttested = (msg: unknown): boolean =>
  typeof msg === 'object' && msg !== null && (msg as { adult?: unknown }).adult === true;

export const ADULT_REQUIRED = 'Please confirm you’re 18 or older first.';

export type Vote = 'y' | 'm' | 'n';
export type Energy = 'low' | 'mid' | 'high';
export type VibeId = 'rose' | 'coral' | 'plum' | 'lagoon' | 'iris';
export type Phase = 'lobby' | 'home' | 'unlock' | 'ceiling' | 'arrive' | 'card' | 'close';

/** Saved on each phone only. Uploaded when a phone joins a room, merged on the server. */
export interface Progress {
  v: 1;
  unlocked: number[];
  seen: Record<string, string[]>;
  last: Record<string, string[]>;
  parked: Record<string, number>;
  capsule: { d: number; items: string[] }[];
  sessions: number;
  /** This phone's own private "curious" taps. Never shared with the partner. */
  curious: Record<string, number>;
}

export const emptyProgress = (): Progress => ({
  v: 1, unlocked: [1, 2], seen: {}, last: {}, parked: {}, capsule: [], sessions: 0, curious: {},
});

export type CardView =
  | { kind: 'twist'; seq: number; text: string; dir: 'up' | 'down' }
  | {
      kind: 'card'; seq: number; level: number; card: Card | null;
      mystery: boolean; myFlip: boolean; partnerFlip: boolean; flipped: boolean;
      gate: null | { teaser: string; myVote: Vote | null; partnerVoted: boolean };
      timerEndsAt: number | null;
    };

export interface View {
  code: string;
  me: 0 | 1;
  names: [string, string];
  partnerConnected: boolean;
  bothJoined: boolean;
  phase: Phase;
  paused: boolean;
  dark: boolean;
  /** Which phone plays music. Together only one does, so the two never echo; apart, both may. */
  music: 'me' | 'partner' | 'both' | null;
  /** Long-distance mode: apart, on a call. */
  apart: boolean;
  /** Touches are opt-in for the receiver. Shown to the sender so the button only appears when welcome. */
  partnerAllowsTouch: boolean;
  meAllowsTouch: boolean;
  /** Couple Pass is on for this room (either partner bought it). */
  pass: boolean;
  unlocked: number[];
  sessions: number;
  totalCards: number;
  unlock: null | { l: number; samples: Card[]; myVote: boolean | null; partnerVoted: boolean; opened: boolean };
  ceiling: null | { myPick: number | null; myConfirm: boolean; partnerDone: boolean; meDone: boolean };
  arrive: null | {
    tonight: number; energy: Energy; myVibe: VibeId | null; partnerVibe: VibeId | null;
    memory: string | null; myReady: boolean; partnerReady: boolean; countdownAt: number | null;
  };
  session: null | { idx: number; N: number; tonight: number; card: CardView | null; keptIds: string[] };
  close: null | {
    stage: 0 | 1; closer: string; env: string; kept: string[];
    myOpen: boolean; partnerOpen: boolean; countdownAt: number | null;
    /** My own private share opt-in. The partner's is never sent. */
    myShare: boolean;
    /** Present only when both opted in: a safe-for-work card to share. */
    shareCard: null | { question: string; nights: number };
  };
}

export type Action =
  | { a: 'unlock:open'; l: number }
  | { a: 'unlock:vote'; yes: boolean }
  | { a: 'home' }
  | { a: 'tonight' }
  | { a: 'ceiling:pick'; l: number }
  | { a: 'ceiling:confirm'; on: boolean }
  | { a: 'ceiling:done' }
  | { a: 'energy'; v: Energy }
  | { a: 'vibe'; v: VibeId }
  | { a: 'ready' }
  | { a: 'flip'; seq: number }
  | { a: 'gate'; seq: number; v: Vote }
  | { a: 'next'; seq: number }
  | { a: 'timer'; seq: number }
  | { a: 'keep'; seq: number }
  | { a: 'softer' }
  | { a: 'pause' }
  | { a: 'resume' }
  | { a: 'leave' }
  | { a: 'dark'; on: boolean }
  | { a: 'music'; on: boolean }
  | { a: 'apart'; on: boolean }
  | { a: 'share'; on: boolean }
  | { a: 'touch:allow'; on: boolean }
  | { a: 'open' }
  | { a: 'finish' };

export const REACTIONS = ['❤️', '🔥', '😂', '😳', '🥰'] as const;
export type Reaction = (typeof REACTIONS)[number];
