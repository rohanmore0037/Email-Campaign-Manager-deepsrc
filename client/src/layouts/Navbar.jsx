import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-blue-100 transition duration-300">
            Your App Name
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="font-medium hover:text-blue-100 transition duration-300 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="font-medium bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="font-medium hover:text-blue-100 transition duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="font-medium bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;