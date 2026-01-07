import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * Index page - serves as the root entry point
 * Checks authentication status and redirects to appropriate page
 */
export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Redirect based on auth status
    if (isLoggedIn) {
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bkash-50 to-bkash-100">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-bkash-600" />
          <h1 className="text-xl font-semibold text-gray-800">amarcash</h1>
        </div>
        <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
      </div>
    </div>
  );
}
