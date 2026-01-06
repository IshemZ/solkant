import { describe, it, expect } from 'vitest';
import {
  announcements,
  hasUnseenAnnouncements,
  getUnseenCount,
  getVisibleAnnouncements,
} from '../announcements';

describe('announcements', () => {
  describe('announcements array', () => {
    it('should have 3 initial announcements', () => {
      expect(announcements).toHaveLength(3);
    });

    it('should have French titles', () => {
      expect(announcements[0].title).toBe('Forfaits : packs + réduction automatique');
      expect(announcements[1].title).toBe('Option paiement en 4 fois');
      expect(announcements[2].title).toBe('Personnalise le nom de tes PDF');
    });

    it('should have dates in descending order', () => {
      expect(announcements[0].publishedAt.getTime()).toBeGreaterThan(
        announcements[1].publishedAt.getTime()
      );
      expect(announcements[1].publishedAt.getTime()).toBeGreaterThan(
        announcements[2].publishedAt.getTime()
      );
    });

    it('should have unique IDs', () => {
      const ids = announcements.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('hasUnseenAnnouncements', () => {
    it('should return true when lastSeenAt is null', () => {
      expect(hasUnseenAnnouncements(null)).toBe(true);
    });

    it('should return true when lastSeenAt is before newest announcement', () => {
      const beforeNewest = new Date('2025-01-05T23:59:59Z');
      expect(hasUnseenAnnouncements(beforeNewest)).toBe(true);
    });

    it('should return false when lastSeenAt is after newest announcement', () => {
      const afterNewest = new Date('2025-01-07T00:00:00Z');
      expect(hasUnseenAnnouncements(afterNewest)).toBe(false);
    });

    it('should return false when lastSeenAt equals newest announcement', () => {
      const newestDate = announcements[0].publishedAt;
      expect(hasUnseenAnnouncements(newestDate)).toBe(false);
    });
  });

  describe('getUnseenCount', () => {
    it('should return all announcements when lastSeenAt is null', () => {
      expect(getUnseenCount(null)).toBe(announcements.length);
    });

    it('should return 0 when lastSeenAt is after all announcements', () => {
      const afterAll = new Date('2025-01-10T00:00:00Z');
      expect(getUnseenCount(afterAll)).toBe(0);
    });

    it('should return 1 when lastSeenAt is between second and first', () => {
      const betweenSecondAndFirst = new Date('2025-01-05T12:00:00Z');
      expect(getUnseenCount(betweenSecondAndFirst)).toBe(1);
    });

    it('should return 2 when lastSeenAt is between third and second', () => {
      const betweenThirdAndSecond = new Date('2025-01-04T12:00:00Z');
      expect(getUnseenCount(betweenThirdAndSecond)).toBe(2);
    });

    it('should return 3 when lastSeenAt is before all announcements', () => {
      const beforeAll = new Date('2025-01-01T00:00:00Z');
      expect(getUnseenCount(beforeAll)).toBe(3);
    });
  });

  describe('getVisibleAnnouncements', () => {
    it('should return all announcements when lastSeenAt is null', () => {
      const visible = getVisibleAnnouncements(null);
      expect(visible).toHaveLength(announcements.length);
      expect(visible.every((a) => a.isNew)).toBe(true);
    });

    it('should mark no announcements as new when lastSeenAt is after all', () => {
      const afterAll = new Date('2025-01-10T00:00:00Z');
      const visible = getVisibleAnnouncements(afterAll);
      expect(visible).toHaveLength(announcements.length);
      expect(visible.every((a) => !a.isNew)).toBe(true);
    });

    it('should mark only new announcements correctly', () => {
      const betweenSecondAndFirst = new Date('2025-01-05T12:00:00Z');
      const visible = getVisibleAnnouncements(betweenSecondAndFirst);
      expect(visible).toHaveLength(announcements.length);
      expect(visible[0].isNew).toBe(true); // Newest
      expect(visible[1].isNew).toBe(false); // Second
      expect(visible[2].isNew).toBe(false); // Oldest
    });

    it('should return announcements in date descending order', () => {
      const visible = getVisibleAnnouncements(null);
      for (let i = 0; i < visible.length - 1; i++) {
        expect(visible[i].publishedAt.getTime()).toBeGreaterThanOrEqual(
          visible[i + 1].publishedAt.getTime()
        );
      }
    });

    it('should preserve all announcement properties', () => {
      const visible = getVisibleAnnouncements(null);
      visible.forEach((v, i) => {
        expect(v.id).toBe(announcements[i].id);
        expect(v.title).toBe(announcements[i].title);
        expect(v.description).toBe(announcements[i].description);
        expect(v.publishedAt).toBe(announcements[i].publishedAt);
      });
    });
  });
});
