import { BaseClient, ClientOptions } from '../client.js';
import {
  HansardSearchResponse,
  HansardSearchParams,
  HansardContributionSearchParams,
  HansardContributionType,
  MemberContributionSummary,
  MemberContributionSummaryParams,
  HansardDebateSearchParams,
  HansardDivisionSearchParams,
  HansardMemberSearchParams,
  HansardDebate,
  HansardSpeaker,
  HansardDivision,
  HansardContribution,
  SittingDay,
  SittingDaysParams,
  HansardSection,
  SectionsForDayParams,
} from './types.js';

const BASE_URL = 'https://hansard-api.parliament.uk/';

export class HansardClient extends BaseClient {
  constructor(options?: ClientOptions) {
    super(BASE_URL, options);
  }

  // ─── Search ────────────────────────────────────────────────

  async search(params?: HansardSearchParams): Promise<HansardSearchResponse> {
    return this.request('/search.json', params as Record<string, unknown>);
  }

  async searchContributions(type: HansardContributionType, params?: HansardContributionSearchParams): Promise<HansardSearchResponse> {
    return this.request(`/search/contributions/${type}.json`, params as Record<string, unknown>);
  }

  async getMemberContributionSummary(id: number, params?: MemberContributionSummaryParams): Promise<MemberContributionSummary> {
    return this.request(`/search/membercontributionsummary/${id}.json`, params as Record<string, unknown>);
  }

  async searchDebates(params?: HansardDebateSearchParams): Promise<HansardSearchResponse> {
    return this.request('/search/debates.json', params as Record<string, unknown>);
  }

  async searchDivisions(params?: HansardDivisionSearchParams): Promise<HansardSearchResponse> {
    return this.request('/search/divisions.json', params as Record<string, unknown>);
  }

  async searchMembers(params?: HansardMemberSearchParams): Promise<HansardSearchResponse> {
    return this.request('/search/members.json', params as Record<string, unknown>);
  }

  // ─── Debates ───────────────────────────────────────────────

  async getDebate(id: string): Promise<HansardDebate> {
    return this.request(`/debates/debate/${id}.json`);
  }

  async getDebateSpeakers(id: string): Promise<HansardSpeaker[]> {
    return this.request(`/debates/speakerslist/${id}.json`);
  }

  async getDebateDivisions(id: string): Promise<HansardDivision[]> {
    return this.request(`/debates/divisions/${id}.json`);
  }

  async getMemberDebateContributions(id: string): Promise<HansardContribution[]> {
    return this.request(`/debates/memberdebatecontributions/${id}.json`);
  }

  // ─── Sitting Days & Overview ───────────────────────────────

  async getSittingDays(params?: SittingDaysParams): Promise<SittingDay[]> {
    return this.request('/historicsittingdays', params as Record<string, unknown>);
  }

  async getLastSittingDate(): Promise<string> {
    return this.request('/overview/lastsittingdate.json');
  }

  async getSectionsForDay(params: SectionsForDayParams): Promise<HansardSection[]> {
    return this.request('/overview/sectionsforday.json', { ...params } as Record<string, unknown>);
  }
}

export * from './types.js';
