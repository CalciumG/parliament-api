import { BaseClient, ClientOptions } from '../client.js';
import { MemberApiItem, QuestionsApiResponse } from '../types.js';
import {
  WrittenQuestion,
  WrittenQuestionSearchParams,
  WrittenStatement,
  WrittenStatementSearchParams,
  DailyReport,
  DailyReportParams,
} from './types.js';

const BASE_URL = 'https://questions-statements-api.parliament.uk/api/';

export class QuestionsClient extends BaseClient {
  constructor(options?: ClientOptions) {
    super(BASE_URL, options);
  }

  // ─── Written Questions ─────────────────────────────────────

  async searchWrittenQuestions(params?: WrittenQuestionSearchParams): Promise<QuestionsApiResponse<WrittenQuestion>> {
    return this.request('/writtenquestions/questions', params as Record<string, unknown>);
  }

  async getWrittenQuestion(id: number): Promise<MemberApiItem<WrittenQuestion>> {
    return this.request(`/writtenquestions/questions/${id}`);
  }

  /** Auto-paginating search that yields each page */
  async *searchAllWrittenQuestions(params?: WrittenQuestionSearchParams): AsyncGenerator<MemberApiItem<WrittenQuestion>[]> {
    let skip = params?.skip ?? 0;
    const take = params?.take ?? 20;
    while (true) {
      const page = await this.searchWrittenQuestions({ ...params, skip, take });
      if (page.results.length === 0) break;
      yield page.results;
      skip += take;
      if (skip >= page.totalResults) break;
    }
  }

  // ─── Written Statements ────────────────────────────────────

  async searchWrittenStatements(params?: WrittenStatementSearchParams): Promise<QuestionsApiResponse<WrittenStatement>> {
    return this.request('/writtenstatements/statements', params as Record<string, unknown>);
  }

  async getWrittenStatement(id: number): Promise<MemberApiItem<WrittenStatement>> {
    return this.request(`/writtenstatements/statements/${id}`);
  }

  /** Auto-paginating search that yields each page */
  async *searchAllWrittenStatements(params?: WrittenStatementSearchParams): AsyncGenerator<MemberApiItem<WrittenStatement>[]> {
    let skip = params?.skip ?? 0;
    const take = params?.take ?? 20;
    while (true) {
      const page = await this.searchWrittenStatements({ ...params, skip, take });
      if (page.results.length === 0) break;
      yield page.results;
      skip += take;
      if (skip >= page.totalResults) break;
    }
  }

  // ─── Daily Reports ─────────────────────────────────────────

  async getDailyReports(params?: DailyReportParams): Promise<QuestionsApiResponse<DailyReport>> {
    return this.request('/dailyreports/dailyreports', params as Record<string, unknown>);
  }
}

export * from './types.js';
