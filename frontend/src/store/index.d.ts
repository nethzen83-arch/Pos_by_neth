export declare const store: import("@reduxjs/toolkit/dist/configureStore.js").ToolkitStore<{
    auth: any;
}, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<{
    auth: any;
}, import("redux").AnyAction>]>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
//# sourceMappingURL=index.d.ts.map