// DTO types
export type CallEventDTO =
  | { callId: string; from: string; to: string; started: string; ended?: never }
  | { callId: string; from: string; to: string; ended: string; started?: never };

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
