import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logError } from '@/utils/errorLogger'; 

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      lastPath: window.location.pathname
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error tracking service
    logError(error, errorInfo);
    
    this.setState({ 
      errorInfo,
      lastPath: window.location.pathname 
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Reset error boundary when location changes
    if (this.state.hasError && window.location.pathname !== this.state.lastPath) {
      this.setState({ 
        hasError: false,
        error: null,
        errorInfo: null,
        lastPath: window.location.pathname
      });
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return this.props.fallback || (
        <div className="error-boundary min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Our team has been notified about this issue.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left bg-gray-50 p-3 rounded text-sm">
                <summary className="font-medium cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {this.state.error?.toString()}
                </pre>
                <pre className="whitespace-pre-wrap overflow-x-auto mt-2 text-xs">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="px-4 py-2 bg-[#E83A17] text-white rounded-md hover:bg-[#c53214] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E83A17] focus:ring-offset-2"
              >
                Refresh Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func
};

export default ErrorBoundary;