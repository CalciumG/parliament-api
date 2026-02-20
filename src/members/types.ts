import { House, PaginationParams } from '../types.js';

// ─── Core Models ───────────────────────────────────────────────

export interface Member {
  id: number;
  nameListAs: string;
  nameDisplayAs: string;
  nameFullTitle: string;
  nameAddressAs: string;
  latestParty: Party;
  gender: string;
  latestHouseMembership: HouseMembership;
  thumbnailUrl: string;
}

export interface Party {
  id: number;
  name: string;
  abbreviation: string;
  colour: string;
  isIndependent: boolean;
}

export interface HouseMembership {
  membershipFrom: string | null;
  membershipFromId: number | null;
  house: House | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  membershipEndReason: string | null;
  membershipEndReasonNotes: string | null;
  membershipEndReasonId: number | null;
  membershipStatus: MembershipStatus | null;
}

export interface MembershipStatus {
  statusIsActive: boolean;
  statusDescription: string;
  statusNotes: string | null;
  status: number;
  id: number;
}

// ─── Biography ─────────────────────────────────────────────────

export interface MemberBiography {
  representations: BiographyItem[] | null;
  electionsContested: BiographyItem[] | null;
  houseMemberships: BiographyItem[] | null;
  governmentPosts: BiographyItem[] | null;
  oppositionPosts: BiographyItem[] | null;
  otherPosts: BiographyItem[] | null;
  partyAffiliations: BiographyItem[] | null;
  committeeMemberships: BiographyItem[] | null;
}

export interface BiographyItem {
  house: House | null;
  name: string | null;
  id: number;
  startDate: string;
  endDate: string | null;
  additionalInfo: string | null;
  additionalInfoLink: string | null;
}

// ─── Contact ───────────────────────────────────────────────────

export interface MemberContact {
  type: string;
  typeDescription: string;
  typeId: number;
  isPreferred: boolean;
  isWebAddress: boolean;
  notes: string | null;
  line1: string | null;
  line2: string | null;
  line3: string | null;
  line4: string | null;
  line5: string | null;
  postcode: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
}

// ─── Election Results ──────────────────────────────────────────

export interface ElectionResult {
  result: string | null;
  isNotional: boolean;
  electorate: number;
  turnout: number;
  majority: number;
  winningParty: Party | null;
  electionTitle: string | null;
  electionDate: string;
  electionId: number;
  isGeneralElection: boolean;
  constituencyName: string | null;
  candidates: ElectionCandidate[] | null;
}

export interface ElectionCandidate {
  memberId: number | null;
  name: string;
  party: Party;
  votes: number;
  voteShare: number;
  voteShareChange: number | null;
  isWinner: boolean;
}

// ─── Registered Interests ──────────────────────────────────────

export interface RegisteredInterestCategory {
  id: number;
  name: string;
  sortOrder: number;
  interests: RegisteredInterest[];
}

export interface RegisteredInterest {
  id: number;
  interest: string;
  createdWhen: string;
  lastAmendedWhen: string | null;
  deletedWhen: string | null;
  isCorrection: boolean;
  childInterests: RegisteredInterest[] | null;
}

// ─── Posts ──────────────────────────────────────────────────────

export interface GovernmentOppositionPost {
  type: number | null;
  name: string | null;
  hansardName: string | null;
  id: number;
  postHolders: PostHolder[] | null;
  governmentDepartments: GovernmentDepartment[] | null;
  createdWhen: string;
  order: number;
}

export interface PostHolder {
  member: Member | null;
  startDate: string;
  endDate: string | null;
  layingMinisterName: string | null;
  isPaid: boolean;
}

export interface GovernmentDepartment {
  id: number;
  name: string;
}

// ─── Constituency ──────────────────────────────────────────────

export interface Constituency {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  currentRepresentation: ConstituencyRepresentation | null;
}

export interface ConstituencyRepresentation {
  member: Member | null;
  representation: HouseMembership | null;
}

// ─── Experience / Focus / Synopsis ─────────────────────────────

export interface MemberExperience {
  experience: string;
  organisation: string | null;
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  type: string | null;
}

export interface MemberFocus {
  category: string;
  focus: string;
}

export interface MemberSynopsis {
  value: string;
}

// ─── Staff ─────────────────────────────────────────────────────

export interface MemberStaff {
  id: number;
  name: string;
  role: string | null;
}

// ─── Contribution Summary ──────────────────────────────────────

export interface ContributionSummary {
  house: House;
  topCategories: ContributionCategory[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ContributionCategory {
  type: string;
  total: number;
  lastDate: string | null;
}

// ─── EDMs ──────────────────────────────────────────────────────

export interface Edm {
  id: number;
  title: string;
  primarySponsorMemberId: number;
  dateTabled: string;
  numberOfSignatures: number;
  sessionId: number;
  status: string | null;
  sponsorType: string | null;
}

// ─── Voting ────────────────────────────────────────────────────

export interface MemberVote {
  publishedDivision: PublishedDivision;
  memberVotedAye: boolean;
  inAffirmativeLobby: boolean | null;
}

export interface PublishedDivision {
  divisionId: number;
  date: string;
  publicationUpdated: string;
  number: number;
  isAye: boolean;
  ayeCount: number;
  noCount: number;
  title: string;
}

// ─── Parties ───────────────────────────────────────────────────

export interface PartyStateOfTheParties {
  party: Party;
  male: number;
  female: number;
  nonBinary: number;
  total: number;
}

// ─── Search Params ─────────────────────────────────────────────

export interface MemberSearchParams extends PaginationParams {
  nameStartsWith?: string;
  nameContains?: string;
  house?: House;
  isCurrentMember?: boolean;
  isEligible?: boolean;
  partyId?: number;
  constituencyId?: number;
  gender?: string;
}

export interface MemberHistoricalSearchParams extends PaginationParams {
  nameStartsWith?: string;
  nameContains?: string;
  house?: House;
  partyId?: number;
  constituencyId?: number;
  gender?: string;
}

export interface ContributionSummaryParams {
  page?: number;
  pageSize?: number;
}

export interface EdmParams extends PaginationParams {}

export interface VotingParams extends PaginationParams {
  house?: House;
}

export interface WrittenQuestionsParams extends PaginationParams {
  house?: House;
}

export interface ConstituencySearchParams extends PaginationParams {
  searchText?: string;
}
