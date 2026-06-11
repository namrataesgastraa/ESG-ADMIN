import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '@/lib/store/index'

/**
 * Returns the app's typed Redux dispatch function.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * Returns the app's typed Redux selector hook.
 */
export const useAppSelector = useSelector.withTypes<RootState>()
