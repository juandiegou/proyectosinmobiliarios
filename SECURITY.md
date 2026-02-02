# Security Policy

## Supported Versions

This project is actively maintained with security updates.

| Component | Version | Status |
| --------- | ------- | ------ |
| Next.js   | 15.5.11 | ✅ Security patched |
| React     | 18.3.1  | ✅ Up to date |
| React DOM | 18.3.1  | ✅ Up to date |
| ESLint    | 9.26.0+ | ✅ Security patched |
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
- ✅ **Next.js 15.5.11**: Latest stable patched version
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
- ✅ **Next.js 15.5.11**: Includes patches
- ✅ **Pages Router**: Project uses Pages Router, not App Router

### GHSA-h25m-26qc-wcjf - Next.js HTTP Request Deserialization DoS

**Status:** ✅ **PATCHED**

**Description:**  
High severity vulnerability in Next.js HTTP request deserialization that can lead to DoS when using insecure React Server Components.

**Our Status:**
- ✅ **Next.js 15.5.11**: Patched (vulnerability fixed in 15.4.11+)
- ✅ **Pages Router**: Using Pages Router reduces exposure

### GHSA-5f7q-jpqc-wp7h - Next.js Unbounded Memory via PPR

**Status:** ⚠️ **ACCEPTABLE RISK**

**Description:**  
Moderate severity vulnerability in Next.js Partial Prerendering (PPR) Resume Endpoint that can cause unbounded memory consumption.

**Our Status:**
- ⚠️ **Next.js 15.5.11**: Not fully patched (requires 15.6.0-canary.61+ or 16.x)
- ✅ **PPR Not Used**: Project does not use Partial Prerendering feature
- ✅ **Pages Router**: Using Pages Router, not App Router
- **Risk Assessment**: Low - Vulnerability only affects PPR feature which is not enabled

### GHSA-p5wg-g6qr-c7cg - ESLint Stack Overflow

**Status:** ✅ **PATCHED**

**Description:**  
Moderate severity vulnerability in ESLint causing stack overflow when serializing objects with circular references.

**Our Status:**
- ✅ **ESLint 9.26.0+**: Patched (vulnerability fixed in 9.26.0)

### CVE-2025-55182 & CVE-2025-66478

**Status:** ✅ **PATCHED**

**Description:**  
Previous vulnerabilities in React and Next.js.

**Our Status:**
- ✅ **React 18.3.1**: Includes patches (released December 3, 2025)
- ✅ **Next.js 15.5.11**: Includes patches

## Dependency Security

**Last security audit:** February 2, 2026  
**Result:** ⚠️ **1 moderate vulnerability (acceptable risk)**

### Frontend (Node.js/Next.js)
```bash
npm audit
# 1 moderate severity vulnerability
# GHSA-5f7q-jpqc-wp7h: PPR vulnerability (not applicable - PPR not used)
```

### Backend (Python/FastAPI)
```bash
# All Python dependencies verified secure
# No vulnerabilities found in:
# - FastAPI 0.109.1
# - Jinja2 3.1.5
# - cryptography 46.0.3
# - uvicorn 0.20.0
# - All other dependencies
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
