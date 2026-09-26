import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught unhandled error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[70vh] flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="max-w-md w-full bg-[#1c1b1b] border border-[#333131] rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {this.props.fallbackTitle || 'Ocurrió un inconveniente temporal'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {this.state.error?.message || 'La sección no pudo cargarse correctamente.'}
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recargar y Reanudar</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
