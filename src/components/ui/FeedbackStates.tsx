import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading health records...' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-8 h-8 border-3 border-slate-200 border-t-sky-600 rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}> = ({ title, description, action, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
      {icon && <div className="text-slate-400 mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 rounded-lg shadow-2xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-8 text-center border border-rose-200 bg-rose-50/50 rounded-xl"
    >
      <h3 className="text-base font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold text-rose-800 bg-white border border-rose-300 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const ComingSoonState: React.FC<{
  title: string;
  category: string;
  description: string;
  plannedSources?: string[];
  expectedCapabilities?: string[];
  onBack?: () => void;
}> = ({
  title,
  category,
  description,
  plannedSources = [],
  expectedCapabilities = [],
  onBack,
}) => {
  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>{category}</span>
        <span aria-hidden="true">·</span>
        <span>Verified Integration Roadmap</span>
        <span aria-hidden="true">·</span>
        <span className="font-medium text-slate-700">FitMadix V2</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="text-base text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-xl text-amber-900 text-sm">
        <p className="font-semibold mb-1">Empirical Medical Standard</p>
        <p className="text-xs text-amber-800">
          In strict compliance with FitMadix core product rules, this module does not display
          fabricated databases, simulated clinical metrics, or invented providers. It will connect
          directly to verified medical APIs and peer-reviewed registries in subsequent phases.
        </p>
      </div>

      {plannedSources.length > 0 && (
        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Planned Verified Data Sources</h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {plannedSources.map((source, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-slate-400">✓</span>
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expectedCapabilities.length > 0 && (
        <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Architecture Capabilities</h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {expectedCapabilities.map((cap, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-slate-400">→</span>
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onBack && (
        <div className="pt-2">
          <button
            onClick={onBack}
            className="text-xs font-medium text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
          >
            ← Back to Explore
          </button>
        </div>
      )}
    </div>
  );
};
