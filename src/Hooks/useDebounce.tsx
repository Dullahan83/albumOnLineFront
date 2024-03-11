import { useCallback, useRef } from 'react';

// Hook personnalisé useDebounce
export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  // Définir le type correct pour le timeoutRef
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  // Créez une version debouncée de la fonction callback passée
  const debouncedFunction = useCallback((...args: any[]) => {
    // Nettoyez le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as NodeJS.Timeout); // Cast pour le type correct
    }

    // Définissez un nouveau timeout
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]); // Les dépendances sont callback et delay

  return debouncedFunction;
}
