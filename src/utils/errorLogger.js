// src/utils/errorLogger.js

/**
 * Modern Error Logger for Vite/React Applications
 * Features:
 * - Vite-compatible environment variables
 * - Multiple reporting destinations
 * - Error normalization
 * - Sensitive data redaction
 * - Performance monitoring
 */

// Vite environment configuration
const env = {
  isProduction: import.meta.env.PROD,
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appEnvironment: import.meta.env.MODE || 'development'
};

// Error severity levels (RFC 5424)
const Severity = {
  EMERGENCY: 'emergency',
  ALERT: 'alert',
  CRITICAL: 'critical',
  ERROR: 'error',
  WARNING: 'warning',
  NOTICE: 'notice',
  INFO: 'info',
  DEBUG: 'debug'
};

// Global context store
let globalContext = {
  environment: env.appEnvironment,
  version: env.appVersion,
  user: null
};

/**
 * Initializes the error logger with application context
 * @param {Object} context - Application-wide context
 */
export const initErrorLogger = (context = {}) => {
  globalContext = { ...globalContext, ...context };
};

/**
 * Main error logging function
 * @param {Error|string} error - Error to log
 * @param {Object} [context] - Additional context
 * @param {keyof Severity} [severity=Severity.ERROR] - Error severity
 */
export const logError = async (error, context = {}, severity = Severity.ERROR) => {
  const errorInfo = normalizeError(error);
  const fullContext = { 
    ...globalContext, 
    ...context,
    location: window.location.href,
    timestamp: new Date().toISOString()
  };

  try {
    // Development logging
    if (!env.isProduction) {
      console.groupCollapsed(
        `%c${severity.toUpperCase()}`,
        'color: white; background: red; padding: 2px 4px; border-radius: 3px;',
        errorInfo.message
      );
      console.error('Stack:', errorInfo.stack);
      console.info('Context:', redactSensitiveData(fullContext));
      console.groupEnd();
    }

    // Production logging
    if (env.isProduction) {
      await Promise.all([
        logToConsole(errorInfo, fullContext, severity),
        logToSentry(errorInfo, fullContext, severity),
        logToBackend(errorInfo, fullContext, severity)
      ]);
    }
  } catch (loggingError) {
    console.error('Error logging failed:', loggingError);
  }
};

// Normalization utilities
const normalizeError = (error) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      type: error.name,
      original: error
    };
  }

  return {
    message: String(error),
    stack: new Error().stack,
    type: typeof error,
    original: error
  };
};

// Reporting destinations
const logToConsole = async (error, context, severity) => {
  if (env.isProduction) {
    console[getConsoleMethod(severity)](`[${severity}]`, error.message, context);
  }
};

const logToSentry = async (error, context, severity) => {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.withScope(scope => {
      scope.setLevel(severity);
      scope.setExtras(context);
      window.Sentry.captureException(error.original);
    });
  }
};

const logToBackend = async (error, context, severity) => {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        severity,
        ...error,
        context: redactSensitiveData(context)
      })
    });
  } catch (e) {
    console.error('Failed to log to backend:', e);
  }
};

// Helper functions
const getConsoleMethod = (severity) => {
  switch (severity) {
    case Severity.ERROR:
    case Severity.CRITICAL:
      return 'error';
    case Severity.WARNING:
      return 'warn';
    default:
      return 'log';
  }
};

const redactSensitiveData = (obj) => {
  const sensitiveFields = [
    'password', 'token', 'creditCard', 
    'apiKey', 'authorization', 'cookie'
  ];

  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (sensitiveFields.includes(key.toLowerCase())) {
      return '**REDACTED**';
    }
    return value;
  }));
};

// Convenience methods
export const logWarning = (error, context) => 
  logError(error, context, Severity.WARNING);

export const logCritical = (error, context) => 
  logError(error, context, Severity.CRITICAL);

export const logInfo = (error, context) => 
  logError(error, context, Severity.INFO);

export const logDebug = (error, context) => 
  logError(error, context, Severity.DEBUG);

// React Error Boundary integration
export const captureBoundaryError = (error, errorInfo) => {
  logError(error, {
    ...errorInfo,
    componentStack: errorInfo.componentStack,
    type: 'react-boundary'
  }, Severity.CRITICAL);
};

// Performance monitoring
export const trackPerformance = (metricName, duration, metadata = {}) => {
  logInfo(`${metricName} took ${duration}ms`, {
    ...metadata,
    type: 'performance',
    duration
  }, Severity.INFO);
};