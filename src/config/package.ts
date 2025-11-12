import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

/**
 * Get the directory containing this module
 * @returns Directory path of the current module
 */
const getModuleDir = (): string => {
  // In ES modules, we use import.meta.url to get the file path
  // This works reliably regardless of CWD
  try {
    const moduleUrl = import.meta.url;
    const modulePath = fileURLToPath(moduleUrl);
    return dirname(modulePath);
  } catch {
    // Fallback to process.cwd() if import.meta.url is not available
    return process.cwd();
  }
};

/**
 * Get the plugin root directory (parent of src/)
 * @returns Plugin root directory path
 */
const getPluginRootDir = (): string => {
  const moduleDir = getModuleDir();
  // If we're in src/, go up one level to the plugin root
  if (moduleDir.endsWith('src') || moduleDir.endsWith(join('src', 'config'))) {
    // Go up from src/config -> src -> root OR src -> root
    let root = dirname(moduleDir);
    if (root.endsWith('src')) {
      root = dirname(root);
    }
    return root;
  }
  return moduleDir;
};

/**
 * Try to read package.json from multiple locations
 * @returns package name or null if not found
 */
export const getPackageName = (): string | null => {
  // Strategy:
  // 1. Try CWD first (for tests and development)
  // 2. Fall back to plugin root (for production when running from OpenCode)

  const locations = [
    join(process.cwd(), 'package.json'), // CWD (tests/development)
    join(getPluginRootDir(), 'package.json'), // Plugin root (production)
  ];

  for (const pkgPath of locations) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
        name?: string;
      };
      if (pkg && typeof pkg.name === 'string') {
        return pkg.name;
      }
    } catch {
      // Try next location
      continue;
    }
  }

  return null;
};
