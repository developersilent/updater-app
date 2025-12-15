import { toast } from "sonner";

export function ToastError(message: string) {
  toast.custom((t) => (
    <div className="mt-4 w-full flex flex-col items-center gap-2">
      <div
        key={t}
        role="alert"
        aria-live="assertive"
        className="w-full max-w-md flex items-center gap-3 text-destructive bg-destructive/5 dark:bg-destructive/10 rounded-md px-4 py-3 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0 text-destructive"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  ));
}

export function ToastWarning(message: string) {
  toast.custom((t) => (
    <div className="mt-4 w-full flex flex-col items-center gap-2">
      <div
        key={t}
        role="alert"
        aria-live="assertive"
        className="w-full max-w-md flex items-center gap-3 text-yellow-700 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-md px-4 py-3 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0 text-yellow-600 dark:text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.454 9.692c.75 1.333-.213 2.979-1.743 2.979H4.546c-1.53 0-2.493-1.646-1.744-2.98L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  ));
}

export function ToastInfo(message: string) {
  toast.custom((t) => (
    <div className="mt-4 w-full px-10 flex flex-col items-center gap-2">
      <div
        key={t}
        role="alert"
        aria-live="polite"
        className="w-full max-w-md flex items-center gap-3 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md px-4 py-3 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  ));
}

export function ToastSuccess(message: string) {
  toast.custom((t) => (
    <div className="mt-4 w-full px-10 flex flex-col items-center gap-2">
      <div
        key={t}
        role="alert"
        aria-live="polite"
        className="w-full max-w-md flex items-center gap-3 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md px-4 py-3 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs">{message}</p>
      </div>
    </div>
  ));
}
