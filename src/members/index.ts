import { BaseClient, ClientOptions } from '../client.js';
import { House, MemberApiItem, PaginatedResponse } from '../types.js';
import {
  Member,
  MemberBiography,
  MemberContact,
  MemberSearchParams,
  MemberHistoricalSearchParams,
  ContributionSummary,
  ContributionSummaryParams,
  Edm,
  EdmParams,
  MemberExperience,
  MemberFocus,
  ElectionResult,
  RegisteredInterestCategory,
  MemberStaff,
  MemberVote,
  VotingParams,
  WrittenQuestionsParams,
  GovernmentOppositionPost,
  Party,
  PartyStateOfTheParties,
  Constituency,
  ConstituencySearchParams,
} from './types.js';

const BASE_URL = 'https://members-api.parliament.uk/api/';

export class MembersClient extends BaseClient {
  constructor(options?: ClientOptions) {
    super(BASE_URL, options);
  }

  // ─── Member Search ─────────────────────────────────────────

  async search(params?: MemberSearchParams): Promise<PaginatedResponse<MemberApiItem<Member>>> {
    return this.request('/Members/Search', params as Record<string, unknown>);
  }

  async searchHistorical(params?: MemberHistoricalSearchParams): Promise<PaginatedResponse<MemberApiItem<Member>>> {
    return this.request('/Members/SearchHistorical', params as Record<string, unknown>);
  }

  /** Auto-paginating search that yields each page */
  async *searchAll(params?: MemberSearchParams): AsyncGenerator<MemberApiItem<Member>[]> {
    let skip = params?.skip ?? 0;
    const take = params?.take ?? 20;
    while (true) {
      const page = await this.search({ ...params, skip, take });
      if (page.items.length === 0) break;
      yield page.items;
      skip += take;
      if (skip >= page.totalResults) break;
    }
  }

  // ─── Member Details ────────────────────────────────────────

  async getById(id: number): Promise<MemberApiItem<Member>> {
    return this.request(`/Members/${id}`);
  }

  async getBiography(id: number): Promise<MemberApiItem<MemberBiography>> {
    return this.request(`/Members/${id}/Biography`);
  }

  async getContact(id: number): Promise<MemberApiItem<MemberContact[]>> {
    return this.request(`/Members/${id}/Contact`);
  }

  async getContributionSummary(id: number, params?: ContributionSummaryParams): Promise<MemberApiItem<ContributionSummary>> {
    return this.request(`/Members/${id}/ContributionSummary`, params as Record<string, unknown>);
  }

  async getEdms(id: number, params?: EdmParams): Promise<PaginatedResponse<MemberApiItem<Edm>>> {
    return this.request(`/Members/${id}/Edms`, params as Record<string, unknown>);
  }

  async getExperience(id: number): Promise<MemberApiItem<MemberExperience[]>> {
    return this.request(`/Members/${id}/Experience`);
  }

  async getFocus(id: number): Promise<MemberApiItem<MemberFocus[]>> {
    return this.request(`/Members/${id}/Focus`);
  }

  async getLatestElectionResult(id: number): Promise<MemberApiItem<ElectionResult>> {
    return this.request(`/Members/${id}/LatestElectionResult`);
  }

  async getRegisteredInterests(id: number): Promise<MemberApiItem<RegisteredInterestCategory[]>> {
    return this.request(`/Members/${id}/RegisteredInterests`);
  }

  async getStaff(id: number): Promise<MemberApiItem<MemberStaff[]>> {
    return this.request(`/Members/${id}/Staff`);
  }

  /** Returns the member's synopsis as an HTML string */
  async getSynopsis(id: number): Promise<MemberApiItem<string>> {
    return this.request(`/Members/${id}/Synopsis`);
  }

  async getVoting(id: number, params?: VotingParams): Promise<PaginatedResponse<MemberApiItem<MemberVote>>> {
    return this.request(`/Members/${id}/Voting`, params as Record<string, unknown>);
  }

  async getWrittenQuestions(id: number, params?: WrittenQuestionsParams): Promise<PaginatedResponse<MemberApiItem<unknown>>> {
    return this.request(`/Members/${id}/WrittenQuestions`, params as Record<string, unknown>);
  }

  async getPortraitUrl(id: number): Promise<MemberApiItem<string>> {
    return this.request(`/Members/${id}/PortraitUrl`);
  }

  async getThumbnailUrl(id: number): Promise<MemberApiItem<string>> {
    return this.request(`/Members/${id}/ThumbnailUrl`);
  }

  // ─── Posts ─────────────────────────────────────────────────

  /** Returns an array of government posts (not paginated) */
  async getGovernmentPosts(): Promise<MemberApiItem<GovernmentOppositionPost>[]> {
    return this.request('/Posts/GovernmentPosts');
  }

  /** Returns an array of opposition posts (not paginated) */
  async getOppositionPosts(): Promise<MemberApiItem<GovernmentOppositionPost>[]> {
    return this.request('/Posts/OppositionPosts');
  }

  /** Returns an array of spokesperson posts (not paginated) */
  async getSpokespersons(): Promise<MemberApiItem<GovernmentOppositionPost>[]> {
    return this.request('/Posts/Spokespersons');
  }

  // ─── Parties ───────────────────────────────────────────────

  async getActiveParties(house: House): Promise<PaginatedResponse<MemberApiItem<Party>>> {
    return this.request(`/Parties/GetActive/${house}`);
  }

  async getStateOfTheParties(house: House, date: string): Promise<PaginatedResponse<MemberApiItem<PartyStateOfTheParties>>> {
    return this.request(`/Parties/StateOfTheParties/${house}/${date}`);
  }

  // ─── Constituencies ────────────────────────────────────────

  async searchConstituencies(params?: ConstituencySearchParams): Promise<PaginatedResponse<MemberApiItem<Constituency>>> {
    return this.request('/Location/Constituency/Search', params as Record<string, unknown>);
  }

  async getConstituency(id: number): Promise<MemberApiItem<Constituency>> {
    return this.request(`/Location/Constituency/${id}`);
  }

  async getConstituencyElectionResults(id: number): Promise<MemberApiItem<ElectionResult[]>> {
    return this.request(`/Location/Constituency/${id}/ElectionResults`);
  }
}

export * from './types.js';
