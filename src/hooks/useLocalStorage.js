import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useLocalStorage<T>
 *
 *   Drop-in replacement for useState that syncs to localStorage.
 * - Reads the stored value on mount (falls back to initialValue).
 * - Writes on every state change, debounced by `delay` ms (default 300).
 * - Cross-tab sync: listens to the "storage" event so multiple tabs stay in sync.
 * - Safe: all JSON parse/stringify errors are caught silently.
 *
 * @param {string}   key          localStorage key
 * @param {*}        initialValue fallback when nothing is stored yet
 * @param {object}   [options]
 * @param {number}   [options.delay=300]   debounce write delay in ms
 * @param {function} [options.serialize]   custom serializer   (default JSON.stringify)
 * @param {function} [options.deserialize] custom deserializer (default JSON.parse)
 */
export function useLocalStorage(key, initialValue, options = {}) {
  const { delay = 300, serialize = JSON.stringify, deserialize = JSON.parse } = options;

  // Read once on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? deserialize(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Keep a ref to the current key so the debounced write closure is always fresh.
  const keyRef = useRef(key);
  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  // Debounce timer ref
  const timerRef = useRef(null);

  // Debounced write to localStorage whenever storedValue changes.
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(keyRef.current, serialize(storedValue));
      } catch {
        // Quota exceeded or private-browsing
      }
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [storedValue, serialize, delay]);

  // Cross-tab sync: when another tab writes the same key, update our state.
  useEffect(() => {
    const onStorage = e => {
      if (e.key !== key) return;
      try {
        const next = e.newValue !== null ? deserialize(e.newValue) : initialValue;
        setStoredValue(next);
      } catch {
        // ignore malformed values from other tabs
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initialValue, deserialize]);

  // Stable setter
  const setValue = useCallback(valueOrUpdater => {
    setStoredValue(prev =>
      typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater,
    );
  }, []);

  // wipe just this key from localStorage
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(keyRef.current);
    } catch {
      /* ignore */
    }
    setStoredValue(initialValue);
  }, [initialValue]);

  return [storedValue, setValue, removeValue];
}
