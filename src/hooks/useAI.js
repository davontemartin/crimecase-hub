import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const generateScript = useCallback((caseData, options) =>
    request('/generate-script', { caseData, options }),
  [request]);

  const generateShowNotes = useCallback((caseData, template) =>
    request('/generate-show-notes', { caseData, template }),
  [request]);

  const researchCase = useCallback((caseData, researchType) =>
    request('/research-case', { caseData, researchType }),
  [request]);

  const chatAboutCase = useCallback((caseData, question, history) =>
    request('/case-chat', { caseData, question, history }),
  [request]);

  const searchCases = useCallback((query) =>
    request('/search-case', { query }),
  [request]);

  const fetchCaseMedia = useCallback((caseData) =>
    request('/case-media', { caseData }),
  [request]);

  return { loading, error, generateScript, generateShowNotes, researchCase, chatAboutCase, searchCases, fetchCaseMedia };
}
