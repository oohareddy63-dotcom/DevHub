import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, getLocalStorageItem } from '../../utils/api';

// Async thunks
export const createBuildLog = createAsyncThunk(
  'buildLogs/create',
  async (buildLogData, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.post('/buildlogs/create', buildLogData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create build log');
    }
  }
);

export const fetchBuildLogs = createAsyncThunk(
  'buildLogs/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:4000/api/buildlogs?${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch build logs');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch build logs');
    }
  }
);

export const fetchUserBuildLogs = createAsyncThunk(
  'buildLogs/fetchUser',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:4000/api/buildlogs/user/${userId}?${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch user build logs');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user build logs');
    }
  }
);

export const likeBuildLog = createAsyncThunk(
  'buildLogs/like',
  async (logId, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.put(`/buildlogs/like/${logId}`, {}, token);
      return { logId, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to like build log');
    }
  }
);

export const addComment = createAsyncThunk(
  'buildLogs/comment',
  async ({ logId, text }, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.post(`/buildlogs/comment/${logId}`, { text }, token);
      return { logId, comment: response.comment };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

export const requestHelp = createAsyncThunk(
  'buildLogs/requestHelp',
  async ({ logId, message }, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.post(`/buildlogs/help/${logId}`, { message }, token);
      return { logId, helpRequest: response.helpRequest };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to request help');
    }
  }
);

export const updateBuildLog = createAsyncThunk(
  'buildLogs/update',
  async ({ logId, updateData }, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.put(`/buildlogs/${logId}`, updateData, token);
      return response.buildLog;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update build log');
    }
  }
);

export const deleteBuildLog = createAsyncThunk(
  'buildLogs/delete',
  async (logId, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      await api.delete(`/buildlogs/${logId}`, token);
      return logId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete build log');
    }
  }
);

// Initial state
const initialState = {
  buildLogs: [],
  userBuildLogs: [],
  currentBuildLog: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0
  }
};

// Slice
const buildLogSlice = createSlice({
  name: 'buildLogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBuildLog: (state, action) => {
      state.currentBuildLog = action.payload;
    },
    updateLogInList: (state, action) => {
      const { logId, updates } = action.payload;
      const index = state.buildLogs.findIndex(log => log._id === logId);
      if (index !== -1) {
        state.buildLogs[index] = { ...state.buildLogs[index], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Build Log
      .addCase(createBuildLog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBuildLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buildLogs.unshift(action.payload.buildLog);
      })
      .addCase(createBuildLog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Build Logs
      .addCase(fetchBuildLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBuildLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buildLogs = action.payload.buildLogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBuildLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Build Logs
      .addCase(fetchUserBuildLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBuildLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBuildLogs = action.payload.buildLogs;
      })
      .addCase(fetchUserBuildLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Like Build Log
      .addCase(likeBuildLog.fulfilled, (state, action) => {
        const { logId, isLiked, likesCount } = action.payload;
        const index = state.buildLogs.findIndex(log => log._id === logId);
        if (index !== -1) {
          state.buildLogs[index].isLiked = isLiked;
          state.buildLogs[index].likesCount = likesCount;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { logId, comment } = action.payload;
        const index = state.buildLogs.findIndex(log => log._id === logId);
        if (index !== -1) {
          if (!state.buildLogs[index].comments) {
            state.buildLogs[index].comments = [];
          }
          state.buildLogs[index].comments.push(comment);
        }
      })
      // Request Help
      .addCase(requestHelp.fulfilled, (state, action) => {
        const { logId, helpRequest } = action.payload;
        const index = state.buildLogs.findIndex(log => log._id === logId);
        if (index !== -1) {
          if (!state.buildLogs[index].helpRequests) {
            state.buildLogs[index].helpRequests = [];
          }
          state.buildLogs[index].helpRequests.push(helpRequest);
        }
      })
      // Update Build Log
      .addCase(updateBuildLog.fulfilled, (state, action) => {
        const index = state.buildLogs.findIndex(log => log._id === action.payload._id);
        if (index !== -1) {
          state.buildLogs[index] = action.payload;
        }
      })
      // Delete Build Log
      .addCase(deleteBuildLog.fulfilled, (state, action) => {
        state.buildLogs = state.buildLogs.filter(log => log._id !== action.payload);
      });
  },
});

export const { clearError, setCurrentBuildLog, updateLogInList } = buildLogSlice.actions;
export default buildLogSlice.reducer;
