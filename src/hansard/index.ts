import { BaseClient, ClientOptions } from '../client.js';
import {
  HansardSearchResponse,
  HansardSearchParams,
  HansardPaginatedResponse,
  HansardDebateSearchParams,
  HansardDebateSummary,
  HansardDivisionSearchParams,
  HansardDivisionSummary,
  HansardMemberSearchParams,
  HansardDebate,
  HansardSpeaker,
  HansardDivision,
  HansardContribution,
} from './types.js';

const BASE_URL = 'https://hansard-api.parliament.uk/';

export class HansardClient extends BaseClient {
  constructor(options?: ClientOptions) {
    super(BASE_URL, options);
  }

  // ─── Search ────────────────────────────────────────────────

  /** Full-text search across all Hansard content */
  async search(params?: HansardSearchParams): Promise<HansardSearchResponse> {
    return this.request('/search.json', params as Record<string, unknown>);
  }

  /** Search debates specifically — returns paginated results */
  async searchDebates(params?: HansardDebateSearchParams): Promise<HansardPaginatedResponse<HansardDebateSummary>> {
    return this.request('/search/debates.json', params as Record<string, unknown>);
  }

  /** Search divisions specifically — returns paginated results */
  async searchDivisions(params?: HansardDivisionSearchParams): Promise<HansardPaginatedResponse<HansardDivisionSummary>> {
    return this.request('/search/divisions.json', params as Record<string, unknown>);
  }

  /** Search members by name */
  async searchMembers(params?: HansardMemberSearchParams): Promise<HansardSearchResponse> {
    return this.request('/search/members.json', params as Record<string, unknown>);
  }

  // ─── Debates ───────────────────────────────────────────────

  /** Get a full debate with all contributions */
  async getDebate(id: string): Promise<HansardDebate> {
    return this.request(`/debates/debate/${id}.json`);
  }

  /** Get the speaker list for a debate */
  async getDebateSpeakers(id: string): Promise<HansardSpeaker[]> {
    return this.request(`/debates/speakerslist/${id}.json`);
  }

  /** Get divisions within a debate */
  async getDebateDivisions(id: string): Promise<HansardDivision[]> {
    return this.request(`/debates/divisions/${id}.json`);
  }

  /** Get a member's contributions within a debate */
  async getMemberDebateContributions(id: string): Promise<HansardContribution[]> {
    return this.request(`/debates/memberdebatecontributions/${id}.json`);
  }
}

export * from './types.js';
