import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'polaris',
  eventKey: process.env.INNGEST_EVENT_KEY,
});
