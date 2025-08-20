import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook for managing state with localStorage persistence.
 * 
 * @template T
 * @param {string} key - The localStorage key
 * @param {T | (() => T)} initialValue - The initial value or a function that returns it
 * @param {{ serialize?: (value: T) => string, deserialize?: (value: string) => T }} [options] - Serialization options
 * @returns {[T, (value: T | ((prevValue: T) => T)) => void, () => void]}
 */
function useLocalStorage(key, initialValue, options = {}) {
  const { 
    serialize = JSON.stringify, 
    deserialize = JSON.parse 
  } = options;

  // Get initial value from localStorage or use the provided initialValue
  const getInitialValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : (initialValue instanceof Function ? initialValue() : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  }, [key, initialValue, deserialize]);

  const [storedValue, setStoredValue] = useState(getInitialValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, serialize]);

  // Remove item from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync changes across tabs
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue ? deserialize(event.newValue) : (initialValue instanceof Function ? initialValue() : initialValue);
          if (newValue !== storedValue) {
            setStoredValue(newValue);
          }
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storedValue, initialValue, deserialize]);

  // Hydrate state after SSR
  useEffect(() => {
    if (typeof window !== 'undefined' && storedValue !== getInitialValue()) {
      setStoredValue(getInitialValue());
    }
    // We only want this to run once after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;