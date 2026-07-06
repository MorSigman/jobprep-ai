export function redactPersonalInfo(text: string): string {
  let t = text;

  // Email addresses
  t = t.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "[EMAIL]");

  // Israeli phone: 05x, 07x, +972...
  t = t.replace(
    /(?:\+972|972)[\s\-.]?(?:5[0-9]|7[0-9]|[23489])[\s\-.]?\d{3}[\s\-.]?\d{4}/g,
    "[PHONE]"
  );
  t = t.replace(/\b0(?:5[0-9]|7[0-9]|[23489])[\s\-.]?\d{3}[\s\-.]?\d{4}\b/g, "[PHONE]");

  // International phone: +x...
  t = t.replace(/\+\d{1,3}[\s\-.]?\(?\d{1,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{4}/g, "[PHONE]");

  // URLs (http/https)
  t = t.replace(/https?:\/\/[^\s<>"'֐-׿]+/g, "[URL]");
  t = t.replace(/www\.[^\s<>"'֐-׿]+/g, "[URL]");

  // LinkedIn / GitHub standalone links not caught above
  t = t.replace(/linkedin\.com\/[^\s<>"']+/g, "[URL]");
  t = t.replace(/github\.com\/[^\s<>"']+/g, "[URL]");

  // 9-digit Israeli ID-like numbers (standalone)
  t = t.replace(/\b\d{9}\b/g, "[ID]");

  return t;
}
