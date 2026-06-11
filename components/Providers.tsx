'use client'

import { useEffect, type ReactNode } from 'react'
import { Provider } from 'react-redux'

import { useAppDispatch } from '@/lib/store/hooks'
import { store } from '@/lib/store/index'
import { rehydrateAuth } from '@/lib/store/slices/authSlice'

function AuthRehydrator({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(rehydrateAuth())
  }, [dispatch])

  return <>{children}</>
}

/**
 * Provides the Redux store to the application tree.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRehydrator>{children}</AuthRehydrator>
    </Provider>
  )
}
