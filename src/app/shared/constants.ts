export const CALLS_WEBHOOKS_QUEUE = {
  name: 'callsWebhooks',
  jobs: {
    createCall: 'processCreateCall',
    endCall: 'processEndCall',
  },
};
