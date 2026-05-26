import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
export default function NotFound() {
    const navigate = useNavigate();
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 p-4", children: _jsx(Card, { className: "card max-w-md w-full", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(ErrorIcon, { className: "text-red-500 text-6xl mb-4" }), _jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "404" }), _jsx("p", { className: "text-gray-600 mb-6", children: "The page you are looking for could not be found." }), _jsx(Button, { variant: "contained", color: "primary", onClick: () => navigate('/dashboard'), children: "Go to Dashboard" })] }) }) }));
}
//# sourceMappingURL=NotFound.js.map