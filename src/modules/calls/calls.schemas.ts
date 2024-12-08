// DTO types
export type CallEventDTO =
  | { callId: string; from: string; to: string; started: Date; ended?: never }
  | { callId: string; from: string; to: string; ended: Date; started?: never };

export type FailedCallDTO = {
  id: number;
  from: string;
  to: string;
  startedAt: Date;
};

// Service method types
export type CreateCallInput = {
  remoteCallId: string;
  from: string;
  to: string;
  startedAt: Date;
};

export type EndCallInput = {
  remoteCallId: string;
  endedAt: Date;
};