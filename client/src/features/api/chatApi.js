import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const useChatApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}`, credentials: "include" }),
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    getUsersList: builder.query({
      query: () => `/api/user/all`,
    }),

    getChatList: builder.query({
      query: () => `/api/chat/getAll`,
    })
  }),
})

// Export hooks for usage in functional components
export const { useGetUsersListQuery, useGetChatListQuery } = useChatApi;
