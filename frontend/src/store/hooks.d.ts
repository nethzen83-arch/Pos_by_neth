import { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from './index.js';
export declare const useAppDispatch: () => import("redux-thunk").ThunkDispatch<{
    auth: any;
}, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
//# sourceMappingURL=hooks.d.ts.map