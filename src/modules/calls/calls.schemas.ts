export type CallEventDTO =
  | { callId: string; from: string; to: string; started: Date; ended?: never }
  | { callId: string; from: string; to: string; ended: Date; started?: never };
