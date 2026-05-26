import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/authSlice';
import { Card, CardContent, TextField, Button, Alert, CircularProgress } from '@mui/material';
export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await dispatch(login(formData)).unwrap();
            if (result) {
                navigate('/dashboard');
            }
        }
        catch (err) {
            setError(err || 'Login failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Card, { className: "card", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && _jsx(Alert, { severity: "error", children: error }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Email Address" }), _jsx(TextField, { fullWidth: true, type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "admin@nethsys.com", required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Password" }), _jsx(TextField, { fullWidth: true, type: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "Enter your password", required: true, disabled: loading })] }), _jsx(Button, { fullWidth: true, variant: "contained", color: "primary", size: "large", type: "submit", disabled: loading, children: loading ? _jsx(CircularProgress, { size: 24 }) : 'Sign In' }), _jsx("div", { className: "text-center text-sm", children: _jsxs("p", { className: "text-gray-600", children: ["Don't have an account?", ' ', _jsx("a", { href: "/register", className: "text-blue-600 hover:underline font-semibold", children: "Sign up" })] }) })] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [_jsx("p", { className: "text-xs text-gray-600 text-center mb-2", children: "Demo Credentials:" }), _jsxs("p", { className: "text-xs text-gray-500 text-center", children: ["Email: admin@nethsys.com", _jsx("br", {}), "Password: password123"] })] })] }) }));
}
//# sourceMappingURL=Login.js.map