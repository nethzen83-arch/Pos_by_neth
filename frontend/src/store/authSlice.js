import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../services/api.js';
const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
};
// Load auth from localStorage
const loadAuthFromStorage = () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
        try {
            return JSON.parse(auth);
        }
        catch {
            return null;
        }
    }
    return null;
};
export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await authApi.login(email, password);
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
    try {
        const response = await authApi.register(data);
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authApi.logout();
        localStorage.removeItem('auth');
        return null;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const response = await authApi.getCurrentUser();
        return response.data.data;
    }
    catch (error) {
        localStorage.removeItem('auth');
        return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
});
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        ...initialState,
        ...loadAuthFromStorage(),
    },
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
            localStorage.setItem('auth', JSON.stringify(action.payload));
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            localStorage.removeItem('auth');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem('auth', JSON.stringify(action.payload));
        })
            .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
            // Register
            .addCase(register.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        })
            .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
            // Logout
            .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.error = null;
        })
            // Get Current User
            .addCase(getCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload;
        })
            .addCase(getCurrentUser.rejected, (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        });
    },
});
export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
//# sourceMappingURL=authSlice.js.map