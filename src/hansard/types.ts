import { House } from '../types.js';

// ─── Search Response ───────────────────────────────────────────

export interface HansardSearchResponse {
  TotalMembers: number;
  TotalContributions: number;
  TotalWrittenStatements: number;
  TotalWrittenAnswers: number;
  TotalCorrections: number;
  TotalPetitions: number;
  TotalDebates: number;
  TotalCommittees: number;
  TotalDivisions: number;
  SearchTerms: string[];
  Members: HansardMember[];
  Contributions: HansardContribution[];
  WrittenStatements: HansardWrittenStatement[];
  WrittenAnswers: HansardWrittenAnswer[];
  Corrections: HansardContribution[];
  Petitions: HansardContribution[];
  Debates: HansardDebateSummary[];
  Divisions: HansardDivisionSummary[];
  Committees: HansardContribution[];
}

// ─── Contribution ──────────────────────────────────────────────

export interface HansardContribution {
  MemberName: string | null;
  MemberId: number | null;
  AttributedTo: string | null;
  ItemId: number;
  ContributionExtId: string | null;
  ContributionText: string | null;
  ContributionTextFull: string | null;
  HRSTag: string | null;
  HansardSection: string | null;
  Timecode: string | null;
  DebateSection: string | null;
  DebateSectionId: number | null;
  DebateSectionExtId: string | null;
  SittingDate: string;
  Section: string | null;
  House: string | null;
  OrderInDebateSection: number | null;
  DebateSectionOrder: number | null;
  Rank: number | null;
}

// ─── Member ────────────────────────────────────────────────────

export interface HansardMember {
  MemberId: number;
  MemberName: string;
  Party: string | null;
  Constituency: string | null;
  House: string | null;
  ThumbnailUrl: string | null;
}

// ─── Written Statement/Answer (Hansard format) ─────────────────

export interface HansardWrittenStatement {
  MemberName: string | null;
  MemberId: number | null;
  Title: string | null;
  DateMade: string | null;
  Department: string | null;
  UIN: string | null;
  ItemId: number;
  House: string | null;
  Rank: number | null;
}

export interface HansardWrittenAnswer {
  MemberName: string | null;
  MemberId: number | null;
  QuestionText: string | null;
  AnswerText: string | null;
  UIN: string | null;
  ItemId: number;
  House: string | null;
  Rank: number | null;
}

// ─── Debate ────────────────────────────────────────────────────

export interface HansardDebateSummary {
  DebateSectionId: number;
  DebateSectionExtId: string | null;
  Title: string | null;
  SittingDate: string;
  House: string | null;
  Section: string | null;
  TotalContributions: number;
  Rank: number | null;
}

export interface HansardDebate {
  ExternalId: string;
  Title: string;
  SittingDate: string;
  House: string;
  Section: string;
  Items: HansardDebateItem[];
}

export interface HansardDebateItem {
  ExternalId: string;
  ItemType: string;
  MemberId: number | null;
  MemberName: string | null;
  AttributedTo: string | null;
  Value: string | null;
  Timecode: string | null;
  OrderInDebateSection: number;
}

// ─── Division ──────────────────────────────────────────────────

export interface HansardDivisionSummary {
  DivisionId: number;
  Title: string | null;
  Date: string;
  House: string | null;
  AyeCount: number;
  NoCount: number;
  Rank: number | null;
}

export interface HansardDivision {
  DivisionId: number;
  Title: string;
  Date: string;
  House: string;
  AyeCount: number;
  NoCount: number;
  AyeMembers: HansardDivisionMember[];
  NoMembers: HansardDivisionMember[];
}

export interface HansardDivisionMember {
  MemberId: number;
  MemberName: string;
  Party: string | null;
}

// ─── Member Contribution Summary ───────────────────────────────

export interface MemberContributionSummary {
  MemberId: number;
  MemberName: string | null;
  TotalOralContributions: number;
  TotalWrittenStatements: number;
  TotalWrittenAnswers: number;
  TotalDebates: number;
  TotalDivisions: number;
}

// ─── Speakers List ─────────────────────────────────────────────

export interface HansardSpeaker {
  MemberId: number;
  MemberName: string;
  Party: string | null;
  Constituency: string | null;
  ThumbnailUrl: string | null;
}

// ─── Sitting Days ──────────────────────────────────────────────

export interface SittingDay {
  Date: string;
  House: string;
}

// ─── Overview / Sections ───────────────────────────────────────

export interface HansardSection {
  Id: number;
  ExternalId: string | null;
  Title: string;
  House: string;
  SittingDate: string;
  Section: string;
}

// ─── Paginated Search Response (debates, divisions) ───────────

export interface HansardPaginatedResponse<T> {
  Results: T[];
  TotalResultCount: number;
}

// ─── Search Params ─────────────────────────────────────────────

export interface HansardSearchParams {
  searchTerm?: string;
  memberId?: number;
  house?: 'Commons' | 'Lords';
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export interface HansardContributionSearchParams {
  searchTerm?: string;
  memberId?: number;
  house?: 'Commons' | 'Lords';
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export type HansardContributionType =
  | 'contributions'
  | 'writtenstatements'
  | 'writtenanswers'
  | 'corrections'
  | 'petitions'
  | 'debates'
  | 'divisions'
  | 'committees';

export interface HansardDebateSearchParams {
  searchTerm?: string;
  house?: 'Commons' | 'Lords';
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export interface HansardDivisionSearchParams {
  searchTerm?: string;
  house?: 'Commons' | 'Lords';
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
}

export interface HansardMemberSearchParams {
  searchTerm?: string;
  house?: 'Commons' | 'Lords';
}

export interface MemberContributionSummaryParams {
  startDate?: string;
  endDate?: string;
  house?: 'Commons' | 'Lords';
}

export interface SittingDaysParams {
  house?: 'Commons' | 'Lords';
  startDate?: string;
  endDate?: string;
}

export interface SectionsForDayParams {
  date: string;
  house?: 'Commons' | 'Lords';
}
