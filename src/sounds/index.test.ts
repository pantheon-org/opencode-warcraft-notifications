import { test, expect, describe, beforeEach, jest } from "bun:test";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  sounds,
  getAllSounds,
  getRandomSound,
  getRandomSoundFromCategory,
  soundExists,
  getSoundPath,
  getRandomSoundPath,
} from "../sounds";

describe("sounds data structure", () => {
  test("should have all expected categories", () => {
    const expectedCategories = [
      "humanSelected",
      "humanAcknowledge", 
      "dwarfSelected",
      "dwarfAcknowledge",
      "elfSelected",
      "elfAcknowledge",
      "knightSelected",
      "knightAcknowledge",
      "mageSelected",
      "mageAcknowledge",
      "peasantSelected",
      "peasantAcknowledge",
      "shipSelected",
      "shipAcknowledge",
      "special",
    ];
    
    const actualCategories = Object.keys(sounds);
    expect(actualCategories.sort()).toEqual(expectedCategories.sort());
  });

  test("should have non-empty arrays for each category", () => {
    Object.entries(sounds).forEach(([category, soundFiles]) => {
      expect(Array.isArray(soundFiles)).toBe(true);
      expect(soundFiles.length).toBeGreaterThan(0);
    });
  });

  test("should have wav file extensions", () => {
    Object.entries(sounds).forEach(([category, soundFiles]) => {
      soundFiles.forEach((file) => {
        expect(file).toMatch(/\.wav$/);
      });
    });
  });
});

describe("getAllSounds()", () => {
  test("should return all sounds as flat array", () => {
    const allSounds = getAllSounds();
    const expectedCount = Object.values(sounds).reduce((count, arr) => count + arr.length, 0);
    
    expect(allSounds.length).toBe(expectedCount);
    expect(Array.isArray(allSounds)).toBe(true);
  });

  test("should contain sounds from all categories", () => {
    const allSounds = getAllSounds();
    
    // Check that sounds from each category are included
    Object.values(sounds).forEach((categorySounds) => {
      categorySounds.forEach((sound) => {
        expect(allSounds).toContain(sound as any);
      });
    });
  });
});

describe("getRandomSound()", () => {
  test("should return a valid sound file", () => {
    const randomSound = getRandomSound();
    const allSounds = getAllSounds();
    
    expect(typeof randomSound).toBe("string");
    expect(allSounds).toContain(randomSound as any);
    expect(randomSound).toMatch(/\.wav$/);
  });

  test("should return different sounds across multiple calls", () => {
    // This is probabilistic - with 50+ sounds, getting the same one 10 times is very unlikely
    const results = new Set();
    for (let i = 0; i < 10; i++) {
      results.add(getRandomSound());
    }
    
    // We should get at least 2 different sounds in 10 tries (very conservative)
    expect(results.size).toBeGreaterThanOrEqual(2);
  });
});

describe("getRandomSoundFromCategory()", () => {
  test("should return sound from specified category", () => {
    const categories = Object.keys(sounds) as (keyof typeof sounds)[];
    
    categories.forEach((category) => {
      const randomSound = getRandomSoundFromCategory(category);
      const categorySounds = sounds[category];
      
      expect(typeof randomSound).toBe("string");
      expect(categorySounds).toContain(randomSound as any);
    });
  });

  test("should handle categories with multiple items", () => {
    const sound = getRandomSoundFromCategory("humanSelected");
    expect(sounds.humanSelected).toContain(sound as any);
  });
});

describe("getSoundPath()", () => {
  test("should return correct path structure", () => {
    const testFile = "test.wav";
    const path = getSoundPath(testFile);
    
    expect(typeof path).toBe("string");
    expect(path).toContain("data");
    expect(path).toMatch(new RegExp(testFile + "$"));
  });

  test("should use correct base directory", () => {
    const testFile = "human_selected1.wav" as const;
    const path = getSoundPath(testFile);
    const expectedPath = join(process.cwd(), "data", testFile);
    
    expect(path).toBe(expectedPath);
  });
});

describe("getRandomSoundPath()", () => {
  test("should return valid path to random sound", () => {
    const randomPath = getRandomSoundPath();
    const allSounds = getAllSounds();
    
    expect(typeof randomPath).toBe("string");
    expect(randomPath).toContain("data");
    expect(randomPath).toMatch(/\.wav$/);
    
    // Extract filename and verify it's a valid sound
    const filename = randomPath.split("/").pop()!;
    expect(allSounds).toContain(filename);
  });
});

describe("soundExists()", () => {
  test("should return boolean", async () => {
    // Mock the exists function to avoid filesystem dependencies
    const mockExists = jest.fn(() => Promise.resolve(true));
    
    // Mock the fs/promises module using spyOn
    const fsPromises = await import("fs/promises");
    const spyExists = (jest.spyOn(fsPromises as any, "exists") as any).mockImplementation(mockExists);

    try {
      const result = await soundExists("test.wav");
      expect(typeof result).toBe("boolean");
      expect(mockExists).toHaveBeenCalledTimes(1);
    } finally {
      // Restore original function
      spyExists.mockRestore();
    }
  });

  test("should call exists with correct path", async () => {
    const mockExists = jest.fn(() => Promise.resolve(false));
    
    // Mock the fs/promises module using spyOn
    const fsPromises = await import("fs/promises");
    const spyExists = (jest.spyOn(fsPromises as any, "exists") as any).mockImplementation(mockExists);

    try {
      const testFile = "human_selected1.wav" as const;
      await soundExists(testFile);
      
      const expectedPath = getSoundPath(testFile);
      expect(mockExists).toHaveBeenCalledTimes(1);
      expect(mockExists).toHaveBeenCalledWith(expectedPath);
    } finally {
      // Restore original function
      spyExists.mockRestore();
    }
  });
});
