import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/lib/store/slices/authSlice'
import caseStudyReducer from '@/lib/store/slices/caseStudySlice'
import categoryReducer from '@/lib/store/slices/categorySlice'
import logReducer from '@/lib/store/slices/logSlice'
import blogReducer from '@/lib/store/slices/blogSlice'
import wpCategoryReducer from '@/lib/store/slices/whitePaperCategorySlice'
import whitePaperReducer from '@/lib/store/slices/whitePaperSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    caseStudy: caseStudyReducer,
    category: categoryReducer,
    logs: logReducer,
    blog: blogReducer,
    wpCategory: wpCategoryReducer,
    whitePaper: whitePaperReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
