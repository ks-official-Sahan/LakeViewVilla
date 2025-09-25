"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In a real app, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-lg mx-auto glass-effect">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center"
                >
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </motion.div>

                <CardTitle className="text-xl">Something went wrong</CardTitle>
                <CardDescription>
                  We encountered an unexpected error. Don't worry, our team has
                  been notified.
                </CardDescription>

                {this.state.errorId && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Error ID: {this.state.errorId}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={this.handleRetry} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleReload}
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reload Page
                  </Button>
                </div>

                <Button variant="ghost" asChild className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>

                {/* Error Details (Collapsible) */}
                {(this.state.error || this.state.errorInfo) && (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <Bug className="mr-2 h-3 w-3" />
                        Show Error Details
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="text-xs bg-muted/50 rounded-lg p-3 space-y-2">
                        {this.state.error && (
                          <div>
                            <div className="font-medium text-destructive">
                              Error:
                            </div>
                            <div className="font-mono text-muted-foreground break-all">
                              {this.state.error.message}
                            </div>
                          </div>
                        )}

                        {this.state.error?.stack && (
                          <div>
                            <div className="font-medium text-destructive">
                              Stack Trace:
                            </div>
                            <div className="font-mono text-muted-foreground text-xs break-all max-h-32 overflow-y-auto">
                              {this.state.error.stack}
                            </div>
                          </div>
                        )}

                        {this.state.errorInfo?.componentStack && (
                          <div>
                            <div className="font-medium text-destructive">
                              Component Stack:
                            </div>
                            <div className="font-mono text-muted-foreground text-xs break-all max-h-32 overflow-y-auto">
                              {this.state.errorInfo.componentStack}
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
