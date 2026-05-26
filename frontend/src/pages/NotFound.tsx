import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="card max-w-md w-full">
        <CardContent className="p-8 text-center">
          <ErrorIcon className="text-red-500 text-6xl mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600 mb-6">
            The page you are looking for could not be found.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
