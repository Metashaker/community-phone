import { z } from 'zod';
// DTO types
export type CallEventDTO =
  | {
      call_id: string;
      from: string;
      to: string;
      started: string;
      ended?: never;
    }
  | {
      call_id: string;
      from: string;
      to: string;
      ended: string;
      started?: never;
    };

export const callEventSchema = z.object({
  call_id: z.string(),
  from: z.string(),
  to: z.string(),
  started: z.string().optional(),
  ended: z.string().optional(),
});
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
