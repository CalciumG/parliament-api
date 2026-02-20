import { ClientOptions } from './client.js';
import { MembersClient } from './members/index.js';
import { QuestionsClient } from './questions/index.js';
import { HansardClient } from './hansard/index.js';

export class ParliamentAPI {
  readonly members: MembersClient;
  readonly questions: QuestionsClient;
  readonly hansard: HansardClient;

  constructor(options?: ClientOptions) {
    this.members = new MembersClient(options);
    this.questions = new QuestionsClient(options);
    this.hansard = new HansardClient(options);
  }
}

// Re-export everything
export { MembersClient } from './members/index.js';
export { QuestionsClient } from './questions/index.js';
export { HansardClient } from './hansard/index.js';
export { BaseClient, type ClientOptions } from './client.js';
export * from './types.js';
export * from './members/types.js';
export * from './questions/types.js';
export * from './hansard/types.js';
