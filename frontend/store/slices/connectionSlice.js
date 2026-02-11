import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

// Async thunks
export const sendConnectionRequest = createAsyncThunk(
  'connections/sendRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      await api.post(`/auth/connections/request/${userId}`, {}, token);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send connection request');
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  'connections/acceptRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      await api.put(`/auth/connections/accept/${userId}`, {}, token);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to accept connection request');
    }
  }
);

export const rejectConnectionRequest = createAsyncThunk(
  'connections/rejectRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      await api.put(`/auth/connections/reject/${userId}`, {}, token);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject connection request');
    }
  }
);

export const fetchConnections = createAsyncThunk(
  'connections/fetchConnections',
  async (_, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.get('/auth/connections', token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch connections');
    }
  }
);

export const fetchConnectionRequests = createAsyncThunk(
  'connections/fetchConnectionRequests',
  async (_, { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.get('/auth/connections/requests', token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch connection requests');
    }
  }
);

export const discoverUsers = createAsyncThunk(
  'connections/discoverUsers',
  async (search = '', { rejectWithValue }) => {
    try {
      const token = getLocalStorageItem('token');
      const response = await api.get(`/auth/discover?search=${search}`, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to discover users');
    }
  }
);

const initialState = {
  connections: [],
  connectionRequests: [],
  discoverUsersList: [],
  isLoading: false,
  error: null,
};

const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Request
      .addCase(sendConnectionRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove from discover list and add to requests
        state.discoverUsersList = state.discoverUsersList.filter(u => u._id !== action.payload);
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Accept Request
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        // Remove from requests and add to connections
        state.connectionRequests = state.connectionRequests.filter(u => u._id !== action.payload);
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Reject Request
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        // Remove from requests
        state.connectionRequests = state.connectionRequests.filter(u => u._id !== action.payload);
      })
      .addCase(rejectConnectionRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Connections
      .addCase(fetchConnections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Connection Requests
      .addCase(fetchConnectionRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConnectionRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connectionRequests = action.payload;
      })
      .addCase(fetchConnectionRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Discover Users
      .addCase(discoverUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(discoverUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discoverUsersList = action.payload;
      })
      .addCase(discoverUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = connectionSlice.actions;
export default connectionSlice.reducer;
