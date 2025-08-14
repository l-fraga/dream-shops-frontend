import { useEffect, useState } from 'react'

/**
 * Custom hook to handle hydration mismatch between server and client rendering
 * Returns true once the component has been hydrated on the client-side
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
