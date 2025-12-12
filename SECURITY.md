# Security Policy

## Supported Versions

This project is actively maintained with security updates.

| Component | Version | Status |
| --------- | ------- | ------ |
| Next.js   | 15.4.10 | ✅ Up to date |
| React     | 18.3.1  | ✅ Up to date |
| React DOM | 18.3.1  | ✅ Up to date |
| Node.js   | >=22.0.0 | ✅ Required |

## Security Advisories

### CVE-2025-67779 - React Server Components DoS Vulnerability

**Status:** ✅ **NOT AFFECTED**

**Description:**  
CVE-2025-67779 is an incomplete fix for CVE-2025-55184 affecting React Server Components. A malicious HTTP request can cause infinite loops in the React Server Components runtime, leading to denial of service.

**Affected Versions:**
- React: 19.0.2, 19.1.3, 19.2.2
- Next.js: 13.x, 14.x, 15.x, 16.x (when using App Router)

**Our Status:**
- ✅ **React 18.3.1**: Not affected (vulnerability only affects React 19.x)
- ✅ **Next.js 15.4.10**: Patched version (released December 11, 2025)
- ✅ **Pages Router**: Project uses Pages Router, not App Router (lower risk)

**Patched Versions:**
- React: 19.0.3+, 19.1.4+, 19.2.3+
- Next.js: 15.4.10+, 15.5.9+, 16.0.10+

**Last Verified:** December 12, 2025

### CVE-2025-55184 - React Server Components DoS Vulnerability

**Status:** ✅ **NOT AFFECTED**

**Description:**  
Previous React Server Components vulnerability that was partially addressed.

**Our Status:**
- ✅ **React 18.3.1**: Not affected
- ✅ **Next.js 15.4.10**: Includes patches
- ✅ **Pages Router**: Project uses Pages Router, not App Router

### CVE-2025-55182 & CVE-2025-66478

**Status:** ✅ **PATCHED**

**Description:**  
Previous vulnerabilities in React and Next.js.

**Our Status:**
- ✅ **React 18.3.1**: Includes patches (released December 3, 2025)
- ✅ **Next.js 15.4.10**: Includes patches

## Dependency Security

Last security audit: December 12, 2025  
Result: ✅ **No vulnerabilities found**

```bash
npm audit
# found 0 vulnerabilities
```

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **Email:** Contact the repository maintainers directly
2. **GitHub Security Advisories:** Use the "Security" tab to report privately
3. **Expected Response Time:** Within 48 hours for initial assessment

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

- **Acknowledged:** We'll confirm receipt within 48 hours
- **Assessment:** We'll evaluate the severity within 5 business days
- **Fix Timeline:** Critical issues will be addressed immediately
- **Disclosure:** Coordinated disclosure after patch is available

## Security Best Practices

1. **Dependencies:** Keep all dependencies up to date
2. **Node.js:** Use Node.js 22.x or higher as specified in package.json
3. **Audits:** Run `npm audit` regularly
4. **Updates:** Monitor security advisories for Next.js and React
