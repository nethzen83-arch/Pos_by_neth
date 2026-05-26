import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { register } from '@/store/authSlice';
import { Card, CardContent, TextField, Button, Alert, CircularProgress } from '@mui/material';
export default function Register() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
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
            await dispatch(register(formData)).unwrap();
            navigate('/login');
        }
        catch (err) {
            setError(err || 'Registration failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Card, { className: "card", children: _jsx(CardContent, { className: "p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && _jsx(Alert, { severity: "error", children: error }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "First Name" }), _jsx(TextField, { fullWidth: true, name: "firstName", value: formData.firstName, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Last Name" }), _jsx(TextField, { fullWidth: true, name: "lastName", value: formData.lastName, onChange: handleChange, required: true, disabled: loading })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Username" }), _jsx(TextField, { fullWidth: true, name: "username", value: formData.username, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Email Address" }), _jsx(TextField, { fullWidth: true, type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Password" }), _jsx(TextField, { fullWidth: true, type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, disabled: loading })] }), _jsx(Button, { fullWidth: true, variant: "contained", color: "primary", size: "large", type: "submit", disabled: loading, children: loading ? _jsx(CircularProgress, { size: 24 }) : 'Create Account' }), _jsx("div", { className: "text-center text-sm", children: _jsxs("p", { className: "text-gray-600", children: ["Already have an account?", ' ', _jsx("a", { href: "/login", className: "text-blue-600 hover:underline font-semibold", children: "Sign in" })] }) })] }) }) }));
}
//# sourceMappingURL=Register.js.map