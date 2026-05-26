import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
export default function AuthLayout() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-blue-600 mb-2", children: "Neth ERP" }), _jsx("p", { className: "text-gray-600", children: "Business Management System" })] }), _jsx(Outlet, {})] }) }));
}
//# sourceMappingURL=AuthLayout.js.map