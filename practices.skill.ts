import practicesData from './data/practices-data.json';
import { PracticesData, Practice, Pillar } from './types';

/**
 * PracticesLib manages the 220+ practice bank.
 * Loaded once in-memory, serves read-only queries.
 */
class PracticesLib {
  private data: PracticesData | null = null;

  /**
   * Load practices from JSON file. Call once on app startup.
   */
  async load(): Promise<PracticesData> {
    if (this.data) return this.data;

    this.data = practicesData as PracticesData;
    return this.data;
  }

  /**
   * Get the loaded practices bank. Throws if not loaded yet.
   */
  getBank(): PracticesData {
    if (!this.data) throw new Error('Practices not loaded. Call load() first.');
    return this.data;
  }

  /**
   * Get all practices for a pillar.
   */
  getAllPractices(pillar: Pillar): Practice[] {
    const bank = this.getBank();
    return Object.values(bank[pillar]).flat();
  }

  /**
   * Search practices by text, category, or why explanation.
   */
  search(pillar: Pillar, query: string): Practice[] {
    const practices = this.getAllPractices(pillar);
    const q = query.toLowerCase();
    return practices.filter(
      (p) =>
        p.text.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.why.toLowerCase().includes(q)
    );
  }

  /**
   * Get all practices in a category.
   */
  getByCategory(pillar: Pillar, category: string): Practice[] {
    const bank = this.getBank();
    return bank[pillar]?.[category] || [];
  }

  /**
   * Find exact practice match by pillar, category, and text.
   * Used for selection validation.
   */
  findPractice(pillar: Pillar, category: string, text: string): Practice | null {
    const bank = this.getBank();
    const practices = bank[pillar]?.[category] || [];
    return practices.find((p) => p.text === text) || null;
  }

  /**
   * Get unique references from an array of practices.
   */
  getReferences(practices: Practice[]): string[] {
    const seen = new Set<string>();
    practices.forEach((p) => {
      p.references.forEach((ref) => seen.add(ref));
    });
    return Array.from(seen);
  }

  /**
   * Get practices by level (gentle, moderate, deep).
   */
  getByLevel(pillar: Pillar, level: 'gentle' | 'moderate' | 'deep'): Practice[] {
    const practices = this.getAllPractices(pillar);
    return practices.filter((p) => p.level === level);
  }

  /**
   * Check if practices bank is loaded.
   */
  isLoaded(): boolean {
    return this.data !== null;
  }
}

export const practicesLib = new PracticesLib();
