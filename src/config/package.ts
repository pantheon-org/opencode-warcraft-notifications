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
  // 1. Try plugin root FIRST (for production when running from OpenCode)
  // 2. Fall back to CWD (for tests and development only)
  // This ensures we always get the plugin's own package.json, not the user's project

  const DEBUG = Boolean(process.env.DEBUG_OPENCODE);

  const locations = [
    join(getPluginRootDir(), 'package.json'), // Plugin root (production) - PRIORITY
    join(process.cwd(), 'package.json'), // CWD (tests/development) - FALLBACK
  ];

  if (DEBUG) {
    console.log('[opencode-warcraft-notifications] Looking for package.json in:', locations);
  }

  for (const pkgPath of locations) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
        name?: string;
      };
      if (pkg && typeof pkg.name === 'string') {
        if (DEBUG) {
          console.log(
            '[opencode-warcraft-notifications] Found package name:',
            pkg.name,
            'from:',
            pkgPath,
          );
        }
        return pkg.name;
      }
    } catch (err) {
      if (DEBUG) {
        console.log('[opencode-warcraft-notifications] Failed to read:', pkgPath, err);
      }
      // Try next location
      continue;
    }
  }

  if (DEBUG) {
    console.warn(
      '[opencode-warcraft-notifications] Could not determine package name from any location',
    );
  }

  return null;
};
