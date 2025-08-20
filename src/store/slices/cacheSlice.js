import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cachedData: {},
  loading: false,
  error: null
}

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCachedData: (state, action) => {
      state.cachedData = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearCache: (state) => {
      state.cachedData = {}
    }
  }
})

export const { setCachedData, setLoading, setError, clearCache } = cacheSlice.actions
export default cacheSlice.reducer