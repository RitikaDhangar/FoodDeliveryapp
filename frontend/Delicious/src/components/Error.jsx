import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h3 className="mb-3">Oops! Page not found</h3>
      <p className="text-muted mb-4">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <div>
        <button
          className="btn btn-primary me-2"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;