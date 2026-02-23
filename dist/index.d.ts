import pLimit from 'p-limit';

interface ClientOptions {
    /** Max concurrent requests (default: 5) */
    concurrency?: number;
    /** Max retry attempts on 429/5xx (default: 3) */
    retries?: number;
    /** Base delay in ms for exponential backoff (default: 1000) */
    retryDelay?: number;
}
declare class BaseClient {
    protected readonly baseUrl: string;
    protected readonly limit: ReturnType<typeof pLimit>;
    protected readonly retries: number;
    protected readonly retryDelay: number;
    constructor(baseUrl: string, options?: ClientOptions);
    protected request<T>(path: string, params?: Record<string, unknown>): Promise<T>;
    private fetchWithRetry;
    private sleep;
}

/** House of Parliament */
declare enum House {
    Commons = 1,
    Lords = 2
}
/** Pagination parameters accepted by search endpoints */
interface PaginationParams {
    skip?: number;
    take?: number;
}
/** Standard paginated response wrapper from the Members/Questions APIs */
interface PaginatedResponse<T> {
    items: T[];
    totalResults: number;
    resultContext: string;
    skip: number;
    take: number;
    links: Link[];
}
interface Link {
    rel: string;
    href: string;
    method: string;
}
/** Wrapper that the Members API uses around individual items */
interface MemberApiItem<T> {
    value: T;
    links: Link[];
}
/** Response wrapper used by the Questions & Statements API */
interface QuestionsApiResponse<T> {
    totalResults: number;
    results: MemberApiItem<T>[];
}

interface Member {
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
interface Party {
    id: number;
    name: string;
    abbreviation: string;
    backgroundColour: string;
    foregroundColour: string;
    isLordsMainParty: boolean;
    isLordsSpiritualParty: boolean;
    governmentType: number | null;
    isIndependentParty: boolean;
}
interface HouseMembership {
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
interface MembershipStatus {
    statusIsActive: boolean;
    statusDescription: string;
    statusNotes: string | null;
    status: number;
    id: number;
}
interface MemberBiography {
    representations: BiographyItem[] | null;
    electionsContested: BiographyItem[] | null;
    houseMemberships: BiographyItem[] | null;
    governmentPosts: BiographyItem[] | null;
    oppositionPosts: BiographyItem[] | null;
    otherPosts: BiographyItem[] | null;
    partyAffiliations: BiographyItem[] | null;
    committeeMemberships: BiographyItem[] | null;
}
interface BiographyItem {
    house: House | null;
    name: string | null;
    id: number;
    startDate: string;
    endDate: string | null;
    additionalInfo: string | null;
    additionalInfoLink: string | null;
}
interface MemberContact {
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
    website: string | null;
}
interface ElectionResult {
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
interface ElectionCandidate {
    memberId: number | null;
    name: string;
    party: Party;
    resultChange: string | null;
    rankOrder: number;
    votes: number;
    voteShare: number;
}
interface RegisteredInterestCategory {
    id: number;
    name: string;
    sortOrder: number;
    interests: RegisteredInterest[];
}
interface RegisteredInterest {
    id: number;
    interest: string;
    createdWhen: string;
    lastAmendedWhen: string | null;
    deletedWhen: string | null;
    isCorrection: boolean;
    childInterests: RegisteredInterest[] | null;
}
interface GovernmentOppositionPost {
    type: number | null;
    name: string | null;
    hansardName: string | null;
    id: number;
    postHolders: PostHolder[] | null;
    governmentDepartments: GovernmentDepartment[] | null;
    createdWhen: string;
    order: number;
}
interface PostHolder {
    member: Member | null;
    startDate: string;
    endDate: string | null;
    layingMinisterName: string | null;
    isPaid: boolean;
}
interface GovernmentDepartment {
    id: number;
    name: string;
}
interface Constituency {
    id: number;
    name: string;
    startDate: string;
    endDate: string | null;
    currentRepresentation: ConstituencyRepresentation | null;
}
interface ConstituencyRepresentation {
    member: Member | null;
    representation: HouseMembership | null;
}
interface MemberExperience {
    experience: string;
    organisation: string | null;
    title: string | null;
    startDate: string | null;
    endDate: string | null;
    type: string | null;
}
interface MemberFocus {
    category: string;
    focus: string[];
}
interface MemberStaff {
    id: number;
    name: string;
    role: string | null;
}
interface ContributionSummary {
    house: House;
    topCategories: ContributionCategory[];
    page: number;
    pageSize: number;
    totalCount: number;
}
interface ContributionCategory {
    type: string;
    total: number;
    lastDate: string | null;
}
interface Edm {
    id: number;
    title: string;
    number: number;
    isPrayer: boolean;
    isAmendment: boolean;
    dateTabled: string;
    sponsorsCount: number;
}
interface MemberVote {
    publishedDivision: PublishedDivision;
    memberVotedAye: boolean;
    inAffirmativeLobby: boolean | null;
}
interface PublishedDivision {
    divisionId: number;
    date: string;
    publicationUpdated: string;
    number: number;
    isAye: boolean;
    ayeCount: number;
    noCount: number;
    title: string;
}
interface PartyStateOfTheParties {
    party: Party;
    male: number;
    female: number;
    nonBinary: number;
    total: number;
}
interface MemberSearchParams extends PaginationParams {
    nameStartsWith?: string;
    nameContains?: string;
    house?: House;
    isCurrentMember?: boolean;
    isEligible?: boolean;
    partyId?: number;
    constituencyId?: number;
    gender?: string;
}
interface MemberHistoricalSearchParams extends PaginationParams {
    nameStartsWith?: string;
    nameContains?: string;
    house?: House;
    partyId?: number;
    constituencyId?: number;
    gender?: string;
}
interface ContributionSummaryParams {
    page?: number;
    pageSize?: number;
}
interface EdmParams extends PaginationParams {
}
interface VotingParams extends PaginationParams {
    house?: House;
}
interface WrittenQuestionsParams extends PaginationParams {
    house?: House;
}
interface ConstituencySearchParams extends PaginationParams {
    searchText?: string;
}

declare class MembersClient extends BaseClient {
    constructor(options?: ClientOptions);
    search(params?: MemberSearchParams): Promise<PaginatedResponse<MemberApiItem<Member>>>;
    searchHistorical(params?: MemberHistoricalSearchParams): Promise<PaginatedResponse<MemberApiItem<Member>>>;
    /** Auto-paginating search that yields each page */
    searchAll(params?: MemberSearchParams): AsyncGenerator<MemberApiItem<Member>[]>;
    getById(id: number): Promise<MemberApiItem<Member>>;
    getBiography(id: number): Promise<MemberApiItem<MemberBiography>>;
    getContact(id: number): Promise<MemberApiItem<MemberContact[]>>;
    getContributionSummary(id: number, params?: ContributionSummaryParams): Promise<MemberApiItem<ContributionSummary>>;
    getEdms(id: number, params?: EdmParams): Promise<PaginatedResponse<MemberApiItem<Edm>>>;
    getExperience(id: number): Promise<MemberApiItem<MemberExperience[]>>;
    getFocus(id: number): Promise<MemberApiItem<MemberFocus[]>>;
    getLatestElectionResult(id: number): Promise<MemberApiItem<ElectionResult>>;
    getRegisteredInterests(id: number): Promise<MemberApiItem<RegisteredInterestCategory[]>>;
    getStaff(id: number): Promise<MemberApiItem<MemberStaff[]>>;
    /** Returns the member's synopsis as an HTML string */
    getSynopsis(id: number): Promise<MemberApiItem<string>>;
    getVoting(id: number, params?: VotingParams): Promise<PaginatedResponse<MemberApiItem<MemberVote>>>;
    getWrittenQuestions(id: number, params?: WrittenQuestionsParams): Promise<PaginatedResponse<MemberApiItem<unknown>>>;
    getPortraitUrl(id: number): Promise<MemberApiItem<string>>;
    getThumbnailUrl(id: number): Promise<MemberApiItem<string>>;
    /** Returns an array of government posts (not paginated) */
    getGovernmentPosts(): Promise<MemberApiItem<GovernmentOppositionPost>[]>;
    /** Returns an array of opposition posts (not paginated) */
    getOppositionPosts(): Promise<MemberApiItem<GovernmentOppositionPost>[]>;
    /** Returns an array of spokesperson posts (not paginated) */
    getSpokespersons(): Promise<MemberApiItem<GovernmentOppositionPost>[]>;
    getActiveParties(house: House): Promise<PaginatedResponse<MemberApiItem<Party>>>;
    getStateOfTheParties(house: House, date: string): Promise<PaginatedResponse<MemberApiItem<PartyStateOfTheParties>>>;
    searchConstituencies(params?: ConstituencySearchParams): Promise<PaginatedResponse<MemberApiItem<Constituency>>>;
    getConstituency(id: number): Promise<MemberApiItem<Constituency>>;
    getConstituencyElectionResults(id: number): Promise<MemberApiItem<ElectionResult[]>>;
}

interface WrittenQuestion {
    id: number;
    askingMemberId: number;
    askingMember: QuestionMember | null;
    house: House;
    memberHasInterest: boolean;
    dateTabled: string;
    dateForAnswer: string;
    uin: string;
    questionText: string;
    answeringBodyId: number;
    answeringBodyName: string;
    isWithdrawn: boolean;
    isNamedDay: boolean;
    groupedQuestions: string[] | null;
    answerIsHolding: boolean | null;
    answerIsCorrection: boolean | null;
    answeringMemberId: number | null;
    answeringMember: QuestionMember | null;
    correctingMemberId: number | null;
    correctingMember: QuestionMember | null;
    dateAnswered: string | null;
    answerText: string | null;
    originalAnswerText: string | null;
    comparableAnswerText: string | null;
    dateAnswerCorrected: string | null;
    dateHoldingAnswer: string | null;
    attachmentCount: number;
    heading: string;
    attachments: Attachment[] | null;
    groupedQuestionsDates: GroupedQuestion[] | null;
}
interface QuestionMember {
    id: number;
    name: string | null;
    listAs: string | null;
    party: string | null;
    partyId: number | null;
    partyColour: string | null;
    partyAbbreviation: string | null;
    memberFrom: string | null;
    thumbnailUrl: string | null;
}
interface Attachment {
    fileName: string;
    fileSizeBytes: number;
    url: string;
    title: string | null;
}
interface GroupedQuestion {
    uin: string;
    questionId: number;
    dateTabled: string;
}
interface WrittenStatement {
    id: number;
    memberId: number;
    member: QuestionMember | null;
    memberRole: string | null;
    uin: string;
    dateMade: string;
    answeringBodyId: number;
    answeringBodyName: string;
    title: string;
    text: string;
    house: House;
    noticeNumber: number;
    hasAttachments: boolean;
    hasLinkedStatements: boolean;
    linkedStatements: LinkedStatement[] | null;
    attachments: Attachment[] | null;
}
interface LinkedStatement {
    id: number;
    uin: string;
    title: string;
    house: House;
}
interface DailyReport {
    house: House;
    date: string;
    fileSizeBytes: number;
    url: string;
}
declare enum AnsweredStatus {
    Any = "Any",
    Answered = "Answered",
    Unanswered = "Unanswered"
}
interface WrittenQuestionSearchParams extends PaginationParams {
    searchTerm?: string;
    askingMemberId?: number;
    answeringMemberId?: number;
    tabledWhenFrom?: string;
    tabledWhenTo?: string;
    dateForAnswerWhenFrom?: string;
    dateForAnswerWhenTo?: string;
    answered?: AnsweredStatus;
    answeredWhenFrom?: string;
    answeredWhenTo?: string;
    includeWithdrawn?: boolean;
    expandMember?: boolean;
    correctedWhenFrom?: string;
    correctedWhenTo?: string;
    uIN?: string;
    answeringBodies?: number[];
    members?: number[];
    house?: House;
}
interface WrittenStatementSearchParams extends PaginationParams {
    searchTerm?: string;
    memberId?: number;
    madeWhenFrom?: string;
    madeWhenTo?: string;
    house?: House;
    answeringBodies?: number[];
}
interface DailyReportParams extends PaginationParams {
    house?: House;
    dateFrom?: string;
    dateTo?: string;
}

declare class QuestionsClient extends BaseClient {
    constructor(options?: ClientOptions);
    searchWrittenQuestions(params?: WrittenQuestionSearchParams): Promise<QuestionsApiResponse<WrittenQuestion>>;
    getWrittenQuestion(id: number): Promise<MemberApiItem<WrittenQuestion>>;
    /** Auto-paginating search that yields each page */
    searchAllWrittenQuestions(params?: WrittenQuestionSearchParams): AsyncGenerator<MemberApiItem<WrittenQuestion>[]>;
    searchWrittenStatements(params?: WrittenStatementSearchParams): Promise<QuestionsApiResponse<WrittenStatement>>;
    getWrittenStatement(id: number): Promise<MemberApiItem<WrittenStatement>>;
    /** Auto-paginating search that yields each page */
    searchAllWrittenStatements(params?: WrittenStatementSearchParams): AsyncGenerator<MemberApiItem<WrittenStatement>[]>;
    getDailyReports(params?: DailyReportParams): Promise<QuestionsApiResponse<DailyReport>>;
}

interface HansardSearchResponse {
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
interface HansardContribution {
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
interface HansardMember {
    MemberId: number;
    MemberName: string;
    Party: string | null;
    Constituency: string | null;
    House: string | null;
    ThumbnailUrl: string | null;
}
interface HansardWrittenStatement {
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
interface HansardWrittenAnswer {
    MemberName: string | null;
    MemberId: number | null;
    QuestionText: string | null;
    AnswerText: string | null;
    UIN: string | null;
    ItemId: number;
    House: string | null;
    Rank: number | null;
}
interface HansardDebateSummary {
    DebateSectionId: number;
    DebateSectionExtId: string | null;
    Title: string | null;
    SittingDate: string;
    House: string | null;
    Section: string | null;
    TotalContributions: number;
    Rank: number | null;
}
interface HansardDebate {
    ExternalId: string;
    Title: string;
    SittingDate: string;
    House: string;
    Section: string;
    Items: HansardDebateItem[];
}
interface HansardDebateItem {
    ExternalId: string;
    ItemType: string;
    MemberId: number | null;
    MemberName: string | null;
    AttributedTo: string | null;
    Value: string | null;
    Timecode: string | null;
    OrderInDebateSection: number;
}
interface HansardDivisionSummary {
    DivisionId: number;
    Title: string | null;
    Date: string;
    House: string | null;
    AyeCount: number;
    NoCount: number;
    Rank: number | null;
}
interface HansardDivision {
    DivisionId: number;
    Title: string;
    Date: string;
    House: string;
    AyeCount: number;
    NoCount: number;
    AyeMembers: HansardDivisionMember[];
    NoMembers: HansardDivisionMember[];
}
interface HansardDivisionMember {
    MemberId: number;
    MemberName: string;
    Party: string | null;
}
interface MemberContributionSummary {
    MemberId: number;
    MemberName: string | null;
    TotalOralContributions: number;
    TotalWrittenStatements: number;
    TotalWrittenAnswers: number;
    TotalDebates: number;
    TotalDivisions: number;
}
interface HansardSpeaker {
    MemberId: number;
    MemberName: string;
    Party: string | null;
    Constituency: string | null;
    ThumbnailUrl: string | null;
}
interface SittingDay {
    Date: string;
    House: string;
}
interface HansardSection {
    Id: number;
    ExternalId: string | null;
    Title: string;
    House: string;
    SittingDate: string;
    Section: string;
}
interface HansardPaginatedResponse<T> {
    Results: T[];
    TotalResultCount: number;
}
interface HansardSearchParams {
    searchTerm?: string;
    memberId?: number;
    house?: 'Commons' | 'Lords';
    startDate?: string;
    endDate?: string;
    skip?: number;
    take?: number;
}
interface HansardContributionSearchParams {
    searchTerm?: string;
    memberId?: number;
    house?: 'Commons' | 'Lords';
    startDate?: string;
    endDate?: string;
    skip?: number;
    take?: number;
}
type HansardContributionType = 'contributions' | 'writtenstatements' | 'writtenanswers' | 'corrections' | 'petitions' | 'debates' | 'divisions' | 'committees';
interface HansardDebateSearchParams {
    searchTerm?: string;
    house?: 'Commons' | 'Lords';
    startDate?: string;
    endDate?: string;
    skip?: number;
    take?: number;
}
interface HansardDivisionSearchParams {
    searchTerm?: string;
    house?: 'Commons' | 'Lords';
    startDate?: string;
    endDate?: string;
    skip?: number;
    take?: number;
}
interface HansardMemberSearchParams {
    searchTerm?: string;
    house?: 'Commons' | 'Lords';
}
interface MemberContributionSummaryParams {
    startDate?: string;
    endDate?: string;
    house?: 'Commons' | 'Lords';
}
interface SittingDaysParams {
    house?: 'Commons' | 'Lords';
    startDate?: string;
    endDate?: string;
}
interface SectionsForDayParams {
    date: string;
    house?: 'Commons' | 'Lords';
}

declare class HansardClient extends BaseClient {
    constructor(options?: ClientOptions);
    /** Full-text search across all Hansard content */
    search(params?: HansardSearchParams): Promise<HansardSearchResponse>;
    /** Search debates specifically — returns paginated results */
    searchDebates(params?: HansardDebateSearchParams): Promise<HansardPaginatedResponse<HansardDebateSummary>>;
    /** Search divisions specifically — returns paginated results */
    searchDivisions(params?: HansardDivisionSearchParams): Promise<HansardPaginatedResponse<HansardDivisionSummary>>;
    /** Search members by name */
    searchMembers(params?: HansardMemberSearchParams): Promise<HansardSearchResponse>;
    /** Get a full debate with all contributions */
    getDebate(id: string): Promise<HansardDebate>;
    /** Get the speaker list for a debate */
    getDebateSpeakers(id: string): Promise<HansardSpeaker[]>;
    /** Get divisions within a debate */
    getDebateDivisions(id: string): Promise<HansardDivision[]>;
    /** Get a member's contributions within a debate */
    getMemberDebateContributions(id: string): Promise<HansardContribution[]>;
}

declare class ParliamentAPI {
    readonly members: MembersClient;
    readonly questions: QuestionsClient;
    readonly hansard: HansardClient;
    constructor(options?: ClientOptions);
}

export { AnsweredStatus, type Attachment, BaseClient, type BiographyItem, type ClientOptions, type Constituency, type ConstituencyRepresentation, type ConstituencySearchParams, type ContributionCategory, type ContributionSummary, type ContributionSummaryParams, type DailyReport, type DailyReportParams, type Edm, type EdmParams, type ElectionCandidate, type ElectionResult, type GovernmentDepartment, type GovernmentOppositionPost, type GroupedQuestion, HansardClient, type HansardContribution, type HansardContributionSearchParams, type HansardContributionType, type HansardDebate, type HansardDebateItem, type HansardDebateSearchParams, type HansardDebateSummary, type HansardDivision, type HansardDivisionMember, type HansardDivisionSearchParams, type HansardDivisionSummary, type HansardMember, type HansardMemberSearchParams, type HansardPaginatedResponse, type HansardSearchParams, type HansardSearchResponse, type HansardSection, type HansardSpeaker, type HansardWrittenAnswer, type HansardWrittenStatement, House, type HouseMembership, type Link, type LinkedStatement, type Member, type MemberApiItem, type MemberBiography, type MemberContact, type MemberContributionSummary, type MemberContributionSummaryParams, type MemberExperience, type MemberFocus, type MemberHistoricalSearchParams, type MemberSearchParams, type MemberStaff, type MemberVote, MembersClient, type MembershipStatus, type PaginatedResponse, type PaginationParams, ParliamentAPI, type Party, type PartyStateOfTheParties, type PostHolder, type PublishedDivision, type QuestionMember, type QuestionsApiResponse, QuestionsClient, type RegisteredInterest, type RegisteredInterestCategory, type SectionsForDayParams, type SittingDay, type SittingDaysParams, type VotingParams, type WrittenQuestion, type WrittenQuestionSearchParams, type WrittenQuestionsParams, type WrittenStatement, type WrittenStatementSearchParams };
