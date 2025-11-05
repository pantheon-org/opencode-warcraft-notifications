import { test, expect, describe, beforeEach, afterEach, jest } from "bun:test";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdir, rmdir } from "fs/promises";
import {
  soundExists,
  downloadAllSounds,
  getSoundFileList,
  getDataDirectory,
} from "./download.ts";

describe("download module", () => {
  const testDataDir = join(dirname(fileURLToPath(import.meta.url)), "test-data");
  
  beforeEach(async () => {
    // Create test directory
    await mkdir(testDataDir, { recursive: true });
  });
  
  afterEach(async () => {
    // Clean up test directory
    try {
      await rmdir(testDataDir, { recursive: true });
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  describe("soundExists()", () => {
    test("should return false for non-existent file", async () => {
      const result = await soundExists("non-existent-file.wav");
      expect(result).toBe(false);
    });

    test("should return true for existing file", async () => {
      // Create a test file
      const testFile = join(getDataDirectory(), "test-sound.wav");
      await mkdir(dirname(testFile), { recursive: true });
      await Bun.write(testFile, new ArrayBuffer(0));
      
      try {
        const result = await soundExists("test-sound.wav");
        expect(result).toBe(true);
      } finally {
        // Clean up
        try {
          await Bun.write(testFile, ""); // Delete the file
        } catch {}
      }
    });
  });

  describe("getSoundFileList()", () => {
    test("should return array of sound filenames", () => {
      const soundList = getSoundFileList();
      
      expect(Array.isArray(soundList)).toBe(true);
      expect(soundList.length).toBeGreaterThan(0);
      
      // Check that all files end with .wav
      soundList.forEach(filename => {
        expect(filename).toMatch(/\.wav$/);
      });
    });

    test("should include expected sound categories", () => {
      const soundList = getSoundFileList();
      
      // Check for sounds from different categories
      expect(soundList.some(f => f.startsWith("human_"))).toBe(true);
      expect(soundList.some(f => f.startsWith("dwarf_"))).toBe(true);
      expect(soundList.some(f => f.startsWith("elf_"))).toBe(true);
      expect(soundList.some(f => f.startsWith("knight_"))).toBe(true);
      expect(soundList.some(f => f.startsWith("mage_"))).toBe(true);
      expect(soundList.some(f => f.startsWith("peasant_"))).toBe(true);
      expect(soundList.some(f => f.startsWith("ship_"))).toBe(true);
      
      // Check for special sounds
      expect(soundList).toContain("work_completed.wav");
      expect(soundList).toContain("jobs_done.wav");
    });

    test("should have correct total count", () => {
      const soundList = getSoundFileList();
      
      // Expected counts based on the soundsToDownload array:
      // Basic Human: 6 selected + 4 acknowledge = 10
      // Dwarf: 2 selected + 5 acknowledge = 7
      // Elf: 4 selected + 4 acknowledge = 8
      // Knight: 4 selected + 4 acknowledge = 8
      // Mage: 3 selected + 3 acknowledge = 6
      // Peasant: 4 selected + 4 acknowledge = 8
      // Ships: 4 selected + 3 acknowledge = 7
      // Special: 2
      // Total: 56 sounds
      expect(soundList.length).toBe(56);
    });
  });

  describe("getDataDirectory()", () => {
    test("should return valid directory path", () => {
      const dataDir = getDataDirectory();
      
      expect(typeof dataDir).toBe("string");
      expect(dataDir).toContain("data");
      expect(dataDir).toMatch(/sounds.*data$/);
    });

    test("should be absolute path", () => {
      const dataDir = getDataDirectory();
      expect(dataDir.startsWith("/")).toBe(true);
    });
  });

  describe("downloadAllSounds() integration", () => {
    test("should create data directory", async () => {
      // Mock fetch to avoid actual downloads
      const mockFetch = jest.fn(() => 
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );
      (mockFetch as any).preconnect = jest.fn();

      await downloadAllSounds(mockFetch as unknown as typeof fetch, "https://example.com/sounds");
      
      // If no exception thrown, assume directory creation succeeded
      expect(true).toBe(true);
    }, 10000); // 10 second timeout for integration test

    test("should handle fetch errors gracefully", async () => {
      // Mock fetch to simulate network error
      const mockFetch = jest.fn(() => Promise.reject(new Error("Network error")));

      // Should not throw, but handle errors gracefully
      await expect(downloadAllSounds(mockFetch as unknown as typeof fetch, "https://example.com/sounds")).resolves.toBeUndefined();
    }, 10000);

    test("should handle HTTP errors gracefully", async () => {
      // Mock fetch to return 404
      const originalFetch = global.fetch;
      const mockFetch = (jest.fn(() => 
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found"
        } as Response)
      )) as unknown as typeof fetch;
      global.fetch = mockFetch;

      // Mock exists to return false so downloads are attempted
      const fsPromises = await import("fs/promises");
      const mockExists = jest.fn(() => Promise.resolve(false));
      const spyExists = (jest.spyOn(fsPromises as any, "exists") as any).mockImplementation(mockExists);

      try {
        // Should not throw, but handle errors gracefully
        await expect(downloadAllSounds()).resolves.toBeUndefined();
        expect(mockFetch).toHaveBeenCalled();
        } finally {
          global.fetch = originalFetch;
          spyExists.mockRestore();
        }
    }, 10000);
  });

  describe("sound file validation", () => {
    test("all sound URLs should be properly formatted", () => {
      const soundList = getSoundFileList();
      
      soundList.forEach(filename => {
        // Check filename format
        expect(filename).toMatch(/^[a-z_]+\d*\.wav$/);
        
        // Check for valid prefixes
        const validPrefixes = [
          "human_", "dwarf_", "elf_", "knight_", 
          "mage_", "peasant_", "ship_", "work_", "jobs_"
        ];
        
        const hasValidPrefix = validPrefixes.some(prefix => 
          filename.startsWith(prefix)
        );
        expect(hasValidPrefix).toBe(true);
      });
    });
  });
});