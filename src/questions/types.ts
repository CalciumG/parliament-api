import { House, PaginationParams } from '../types.js';

// ─── Core Models ───────────────────────────────────────────────

export interface WrittenQuestion {
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

export interface QuestionMember {
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

export interface Attachment {
  fileName: string;
  fileSizeBytes: number;
  url: string;
  title: string | null;
}

export interface GroupedQuestion {
  uin: string;
  questionId: number;
  dateTabled: string;
}

// ─── Written Statement ─────────────────────────────────────────

export interface WrittenStatement {
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

export interface LinkedStatement {
  id: number;
  uin: string;
  title: string;
  house: House;
}

// ─── Daily Report ──────────────────────────────────────────────

export interface DailyReport {
  house: House;
  date: string;
  fileSizeBytes: number;
  url: string;
}

// ─── Search Params ─────────────────────────────────────────────

export enum AnsweredStatus {
  Any = 'Any',
  Answered = 'Answered',
  Unanswered = 'Unanswered',
}

export interface WrittenQuestionSearchParams extends PaginationParams {
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

export interface WrittenStatementSearchParams extends PaginationParams {
  searchTerm?: string;
  memberId?: number;
  madeWhenFrom?: string;
  madeWhenTo?: string;
  house?: House;
  answeringBodies?: number[];
}

export interface DailyReportParams extends PaginationParams {
  house?: House;
  dateFrom?: string;
  dateTo?: string;
}
