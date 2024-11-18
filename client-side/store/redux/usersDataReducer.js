// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, signup, updateData, getData } from "../../service/Service";

// Async actions for fetching, creating, updating, and deleting
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await getData();
  return response.data;
});

export const createUser = createAsyncThunk("users/createUser", async (user) => {
  const response = await signup(user);
  return response.data;
});

export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  const response = await updateData(user);
  return response;
});

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    await api.deleteUser(userId);
    return userId;
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ email, password }) => {
    console.log(password)
    const response =await login(email, password);
    return response;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    ids: [],
    entities: {},
    currentUser: null,
    loading: "idle",
    error: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      console.log("Action Payload",action.payload)
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = "idle";
        state.ids = action.payload.map((user) => user.id);
        state.entities = action.payload.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.error.message;
      })

      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.ids.push(user.id);
        state.entities[user.id] = user;
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.currentUser=user
        state.entities[user.id] = user;
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.ids = state.ids.filter((id) => id !== user);
        delete state.entities[user];
      })

      // Login user
      .addCase(loginUser.fulfilled, (state, action) => {
        const user = action.payload;
        console.log(user)
        state.currentUser = user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = "loading";
      });
  },
});
export const { setCurrentUser, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
