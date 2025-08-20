import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light', // 'light' or 'dark'
  sidebarOpen: true,
  modal: {
    isOpen: false,
    content: null,
    size: 'md' // 'sm', 'md', 'lg', 'xl'
  },
  toast: null,
  loading: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        content: action.payload.content,
        size: action.payload.size || 'md'
      }
    },
    closeModal: (state) => {
      state.modal = initialState.modal
    },
    showToast: (state, action) => {
      state.toast = action.payload
    },
    clearToast: (state) => {
      state.toast = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { 
  toggleTheme, 
  toggleSidebar, 
  openModal, 
  closeModal, 
  showToast, 
  clearToast,
  setLoading 
} = uiSlice.actions

export default uiSlice.reducer