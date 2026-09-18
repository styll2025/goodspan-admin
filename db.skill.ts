import Database from 'better-sqlite3';
import { Span, Circle, Member, PracticeSelection, FeedbackEntry } from './types';

class SpanDB {
  private db: Database.Database;

  constructor(filePath: string) {
    this.db = new Database(filePath);
    this.db.pragma('journal_mode = WAL');
    this.migrate();
  }

  private migrate() {
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS spans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        pillar TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        spanId TEXT NOT NULL,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        pillar TEXT NOT NULL,
        circleId TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (spanId) REFERENCES spans(id),
        UNIQUE(spanId, email)
      );

      CREATE TABLE IF NOT EXISTS circles (
        id TEXT PRIMARY KEY,
        spanId TEXT NOT NULL,
        pillarId TEXT NOT NULL,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (spanId) REFERENCES spans(id),
        UNIQUE(spanId, name)
      );

      CREATE TABLE IF NOT EXISTS practice_selections (
        id TEXT PRIMARY KEY,
        memberId TEXT NOT NULL,
        spanId TEXT NOT NULL,
        pillar TEXT NOT NULL,
        category TEXT NOT NULL,
        practiceText TEXT NOT NULL,
        position INTEGER NOT NULL,
        isStartWithThis INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (memberId) REFERENCES members(id),
        FOREIGN KEY (spanId) REFERENCES spans(id),
        UNIQUE(memberId, spanId, position)
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        memberId TEXT NOT NULL,
        spanId TEXT NOT NULL,
        completionRate INTEGER NOT NULL,
        feedbackText TEXT,
        practiceNotes TEXT,
        submittedAt TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (memberId) REFERENCES members(id),
        FOREIGN KEY (spanId) REFERENCES spans(id)
      );

      CREATE INDEX IF NOT EXISTS idx_members_spanId ON members(spanId);
      CREATE INDEX IF NOT EXISTS idx_members_circleId ON members(circleId);
      CREATE INDEX IF NOT EXISTS idx_circles_spanId ON circles(spanId);
      CREATE INDEX IF NOT EXISTS idx_selections_memberId ON practice_selections(memberId);
      CREATE INDEX IF NOT EXISTS idx_feedback_memberId ON feedback(memberId);
    `);
  }

  // SPANS
  createSpan(span: Omit<Span, 'createdAt' | 'updatedAt'>): Span {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      'INSERT INTO spans (id, name, pillar, startDate, endDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(span.id, span.name, span.pillar, span.startDate, span.endDate, now, now);
    return { ...span, createdAt: now, updatedAt: now };
  }

  getSpan(spanId: string): Span | null {
    const stmt = this.db.prepare('SELECT * FROM spans WHERE id = ?');
    return (stmt.get(spanId) as Span) || null;
  }

  getAllSpans(): Span[] {
    const stmt = this.db.prepare('SELECT * FROM spans ORDER BY createdAt DESC');
    return stmt.all() as Span[];
  }

  updateSpan(spanId: string, updates: Partial<Span>): void {
    const now = new Date().toISOString();
    const keys = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt');
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k as keyof Span]);
    const stmt = this.db.prepare(`UPDATE spans SET ${setClause}, updatedAt = ? WHERE id = ?`);
    stmt.run(...values, now, spanId);
  }

  deleteSpan(spanId: string): void {
    const stmt = this.db.prepare('DELETE FROM spans WHERE id = ?');
    stmt.run(spanId);
  }

  // MEMBERS
  createMember(member: Omit<Member, 'createdAt' | 'updatedAt'>): Member {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      'INSERT INTO members (id, spanId, email, name, pillar, circleId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
      member.id,
      member.spanId,
      member.email,
      member.name,
      member.pillar,
      member.circleId || null,
      now,
      now
    );
    return { ...member, createdAt: now, updatedAt: now };
  }

  getMember(memberId: string): Member | null {
    const stmt = this.db.prepare('SELECT * FROM members WHERE id = ?');
    return (stmt.get(memberId) as Member) || null;
  }

  getMembersBySpan(spanId: string): Member[] {
    const stmt = this.db.prepare('SELECT * FROM members WHERE spanId = ? ORDER BY name ASC');
    return stmt.all(spanId) as Member[];
  }

  getMembersByCircle(circleId: string): Member[] {
    const stmt = this.db.prepare('SELECT * FROM members WHERE circleId = ? ORDER BY name ASC');
    return stmt.all(circleId) as Member[];
  }

  updateMember(memberId: string, updates: Partial<Member>): void {
    const now = new Date().toISOString();
    const keys = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt');
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k as keyof Member]);
    const stmt = this.db.prepare(`UPDATE members SET ${setClause}, updatedAt = ? WHERE id = ?`);
    stmt.run(...values, now, memberId);
  }

  deleteMember(memberId: string): void {
    const stmt = this.db.prepare('DELETE FROM members WHERE id = ?');
    stmt.run(memberId);
  }

  // CIRCLES
  createCircle(circle: Omit<Circle, 'createdAt'>): Circle {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      'INSERT INTO circles (id, spanId, pillarId, name, createdAt) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(circle.id, circle.spanId, circle.pillarId, circle.name, now);
    return { ...circle, createdAt: now };
  }

  getCircle(circleId: string): Circle | null {
    const stmt = this.db.prepare('SELECT * FROM circles WHERE id = ?');
    return (stmt.get(circleId) as Circle) || null;
  }

  getCirclesBySpan(spanId: string): Circle[] {
    const stmt = this.db.prepare('SELECT * FROM circles WHERE spanId = ? ORDER BY name ASC');
    return stmt.all(spanId) as Circle[];
  }

  updateCircle(circleId: string, updates: Partial<Circle>): void {
    const keys = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt');
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k as keyof Circle]);
    const stmt = this.db.prepare(`UPDATE circles SET ${setClause} WHERE id = ?`);
    stmt.run(...values, circleId);
  }

  deleteCircle(circleId: string): void {
    const stmt = this.db.prepare('DELETE FROM circles WHERE id = ?');
    stmt.run(circleId);
  }

  addMemberToCircle(memberId: string, circleId: string): void {
    const stmt = this.db.prepare('UPDATE members SET circleId = ? WHERE id = ?');
    stmt.run(circleId, memberId);
  }

  removeMemberFromCircle(memberId: string): void {
    const stmt = this.db.prepare('UPDATE members SET circleId = NULL WHERE id = ?');
    stmt.run(memberId);
  }

  // PRACTICE SELECTIONS
  createPracticeSelection(selection: Omit<PracticeSelection, 'createdAt'>): PracticeSelection {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      'INSERT INTO practice_selections (id, memberId, spanId, pillar, category, practiceText, position, isStartWithThis, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
      selection.id,
      selection.memberId,
      selection.spanId,
      selection.pillar,
      selection.category,
      selection.practiceText,
      selection.position,
      selection.isStartWithThis ? 1 : 0,
      now
    );
    return { ...selection, createdAt: now };
  }

  getPracticeSelectionsByMember(memberId: string, spanId: string): PracticeSelection[] {
    const stmt = this.db.prepare(
      'SELECT * FROM practice_selections WHERE memberId = ? AND spanId = ? ORDER BY position ASC'
    );
    const results = stmt.all(memberId, spanId) as any[];
    return results.map(r => ({ ...r, isStartWithThis: Boolean(r.isStartWithThis) }));
  }

  updatePracticeSelection(selectionId: string, updates: Partial<PracticeSelection>): void {
    const keys = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt');
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => {
      if (k === 'isStartWithThis') return updates[k] ? 1 : 0;
      return updates[k as keyof PracticeSelection];
    });
    const stmt = this.db.prepare(`UPDATE practice_selections SET ${setClause} WHERE id = ?`);
    stmt.run(...values, selectionId);
  }

  deletePracticeSelection(selectionId: string): void {
    const stmt = this.db.prepare('DELETE FROM practice_selections WHERE id = ?');
    stmt.run(selectionId);
  }

  // FEEDBACK
  createFeedback(feedback: Omit<FeedbackEntry, 'createdAt'>): FeedbackEntry {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      'INSERT INTO feedback (id, memberId, spanId, completionRate, feedbackText, practiceNotes, submittedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
      feedback.id,
      feedback.memberId,
      feedback.spanId,
      feedback.completionRate,
      feedback.feedbackText || null,
      feedback.practiceNotes ? JSON.stringify(feedback.practiceNotes) : null,
      feedback.submittedAt,
      now
    );
    return { ...feedback, createdAt: now };
  }

  getFeedbackByMember(memberId: string): FeedbackEntry[] {
    const stmt = this.db.prepare('SELECT * FROM feedback WHERE memberId = ? ORDER BY submittedAt DESC');
    const results = stmt.all(memberId) as any[];
    return results.map(r => ({
      ...r,
      practiceNotes: r.practiceNotes ? JSON.parse(r.practiceNotes) : undefined,
    }));
  }

  getFeedbackBySpan(spanId: string): FeedbackEntry[] {
    const stmt = this.db.prepare('SELECT * FROM feedback WHERE spanId = ? ORDER BY submittedAt DESC');
    const results = stmt.all(spanId) as any[];
    return results.map(r => ({
      ...r,
      practiceNotes: r.practiceNotes ? JSON.parse(r.practiceNotes) : undefined,
    }));
  }

  updateFeedback(feedbackId: string, updates: Partial<FeedbackEntry>): void {
    const keys = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt');
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => {
      if (k === 'practiceNotes') return updates[k] ? JSON.stringify(updates[k]) : null;
      return updates[k as keyof FeedbackEntry];
    });
    const stmt = this.db.prepare(`UPDATE feedback SET ${setClause} WHERE id = ?`);
    stmt.run(...values, feedbackId);
  }

  close() {
    this.db.close();
  }
}

export const db = new SpanDB('./goodspan.db');
