# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Warcraft II Notifications Plugin team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

#### 1. GitHub Security Advisories (Preferred)

1. Go to the [Security tab](https://github.com/pantheon-org/opencode-warcraft-notifications/security)
2. Click "Report a vulnerability"
3. Fill out the form with details

#### 2. Email

Send an email to: **security@pantheon-ai.com**

Include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

After you submit a report, you can expect:

1. **Acknowledgment**: Within 48 hours
2. **Initial Assessment**: Within 5 business days
3. **Regular Updates**: At least every 7 days
4. **Resolution Timeline**: Depends on severity
   - **Critical**: 1-7 days
   - **High**: 7-30 days
   - **Medium**: 30-90 days
   - **Low**: 90+ days

### Disclosure Policy

- We will coordinate with you on the disclosure timeline
- We prefer coordinated disclosure after a fix is available
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We may request a CVE ID for significant vulnerabilities

---

## Security Considerations

### Plugin Architecture

The Warcraft II Notifications Plugin is designed with security in mind:

#### 1. No Network Access

- **Bundled Sounds**: All sound files are bundled with the plugin
- **No Downloads**: No runtime network requests for sound files
- **Offline Operation**: Plugin works completely offline

#### 2. File System Access

The plugin accesses the file system in limited ways:

**Read Operations**:

- Configuration files (`plugin.json`)
- Bundled sound files (from plugin installation directory)

**Write Operations**:

- User data directory (for sound file installation)
- Platform-specific locations:
  - macOS/Linux: `~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/`
  - Windows: `%APPDATA%\opencode\storage\plugin\opencode-warcraft-notifications\`

**Security Measures**:

- Path validation to prevent directory traversal
- Restricted to plugin-specific directories
- No access to sensitive system files
- No modification of OpenCode core files

#### 3. Configuration Security

**Configuration Sources** (in precedence order):

1. Project-specific: `.opencode/plugin.json`
2. Global: `~/.config/opencode/plugin.json`
3. Environment variables: `SOUNDS_DATA_DIR`, `SOUNDS_BASE_URL`

**Security Measures**:

- Schema validation for configuration
- Type checking for all inputs
- Safe defaults for missing configuration
- No execution of user-provided code

#### 4. Platform Integration

**macOS**:

- Uses `afplay` for audio (system binary)
- Uses `osascript` for notifications (system binary)
- No shell injection vulnerabilities (uses Bun's `$` template literal)

**Linux**:

- Uses `canberra-gtk-play` for audio
- Uses `notify-send` for notifications
- No shell injection vulnerabilities

**Security Measures**:

- Parameterized command execution
- No user input in shell commands
- Proper escaping of file paths
- No dynamic code evaluation

---

## Known Security Considerations

### 1. File Path Handling

**Issue**: Custom `soundsDir` configuration could potentially point to sensitive directories.

**Mitigation**:

- Plugin only reads WAV files
- No recursive directory operations
- No file deletion or modification
- Limited to configured directory

**Recommendation**: Users should only configure `soundsDir` to trusted directories.

### 2. Configuration Files

**Issue**: `plugin.json` files could contain malicious configuration.

**Mitigation**:

- Schema validation for all configuration
- Type checking for all values
- Safe defaults for invalid configuration
- No code execution from configuration

**Recommendation**: Only use `plugin.json` files from trusted sources.

### 3. Sound File Content

**Issue**: WAV files could potentially contain malicious data.

**Mitigation**:

- Files are played by system audio tools (`afplay`, `canberra-gtk-play`)
- No custom audio parsing in plugin
- Relies on OS-level audio security

**Recommendation**: Only use sound files from trusted sources (bundled files are safe).

### 4. Environment Variables

**Issue**: Environment variables could be manipulated to change plugin behavior.

**Mitigation**:

- Environment variables only affect file paths
- Path validation prevents directory traversal
- No code execution from environment variables

**Recommendation**: Be cautious when setting `SOUNDS_DATA_DIR` or `SOUNDS_BASE_URL`.

---

## Security Best Practices for Users

### Installation

1. **Install from Official Sources**:

   ```bash
   # Official npm package
   npm install @pantheon-ai/opencode-warcraft-notifications
   ```

2. **Verify Package Integrity**:

   ```bash
   # Check package signature
   npm audit @pantheon-ai/opencode-warcraft-notifications
   ```

3. **Review Permissions**:
   - Plugin only needs read/write access to its data directory
   - No network access required
   - No access to sensitive files

### Configuration

1. **Use Safe Directories**:

   ```json
   {
     "@pantheon-ai/opencode-warcraft-notifications": {
       "soundsDir": "/safe/path/to/sounds"
     }
   }
   ```

2. **Avoid Sensitive Paths**:
   - Don't point `soundsDir` to system directories
   - Don't use paths containing sensitive data
   - Use plugin-specific directories

3. **Validate Configuration**:
   ```bash
   # Validate plugin.json schema
   bun run validate:schema
   ```

### Updates

1. **Keep Plugin Updated**:

   ```bash
   # Update to latest version
   npm update @pantheon-ai/opencode-warcraft-notifications
   ```

2. **Review Changelogs**:
   - Check [CHANGELOG.md](./CHANGELOG.md) for security fixes
   - Review [GitHub Releases](https://github.com/pantheon-org/opencode-warcraft-notifications/releases)

3. **Monitor Security Advisories**:
   - Watch the repository for security updates
   - Subscribe to [GitHub Security Advisories](https://github.com/pantheon-org/opencode-warcraft-notifications/security/advisories)

---

## Security Audit

### Last Audit

- **Date**: 2025-11-10
- **Version**: 1.0.155
- **Auditor**: Pantheon AI Security Team
- **Findings**: No critical or high-severity issues

### Audit Scope

- Source code review
- Dependency analysis
- Configuration security
- File system operations
- Platform integration
- Input validation

### Audit Results

| Category             | Status  | Notes                       |
| -------------------- | ------- | --------------------------- |
| Code Injection       | ✅ Pass | No dynamic code execution   |
| Path Traversal       | ✅ Pass | Proper path validation      |
| File Operations      | ✅ Pass | Limited to plugin directory |
| Configuration        | ✅ Pass | Schema validation in place  |
| Dependencies         | ✅ Pass | No known vulnerabilities    |
| Platform Integration | ✅ Pass | Safe command execution      |

---

## Dependencies

### Security Scanning

We regularly scan dependencies for vulnerabilities:

```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

### Dependency Policy

- **Minimal Dependencies**: Only essential dependencies
- **Regular Updates**: Dependencies updated monthly
- **Vulnerability Monitoring**: Automated scanning via GitHub Dependabot
- **Quick Response**: Security updates applied within 48 hours

### Current Dependencies

**Production**:

- `zod`: Schema validation (security-focused)
- `csstype`: TypeScript types (no runtime code)
- `undici-types`: TypeScript types (no runtime code)

**Development**:

- `@opencode-ai/plugin`: OpenCode plugin SDK
- `typescript`: Type checking
- `eslint`: Code linting
- `prettier`: Code formatting
- `bun-types`: Bun runtime types

All dependencies are regularly audited and updated.

---

## Vulnerability Disclosure Timeline

### Example Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1**: Acknowledgment sent to reporter
3. **Day 3**: Initial assessment completed
4. **Day 7**: Fix developed and tested
5. **Day 10**: Security advisory drafted
6. **Day 14**: Coordinated disclosure with reporter
7. **Day 14**: Patch released
8. **Day 14**: Security advisory published
9. **Day 14**: CVE assigned (if applicable)

### Public Disclosure

After a fix is released:

1. **Security Advisory**: Published on GitHub
2. **Release Notes**: Included in CHANGELOG.md
3. **npm Advisory**: Published to npm
4. **Community Notification**: Announced in discussions

---

## Security Hall of Fame

We recognize security researchers who help improve our security:

### 2025

_No vulnerabilities reported yet_

### How to Get Listed

- Report a valid security vulnerability
- Follow responsible disclosure practices
- Allow us to fix the issue before public disclosure

---

## Contact

### Security Team

- **Email**: security@pantheon-ai.com
- **PGP Key**: Available on request
- **Response Time**: Within 48 hours

### General Support

- **Issues**: [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)
- **Email**: support@pantheon-ai.com

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Maintained By**: Pantheon AI Security Team
