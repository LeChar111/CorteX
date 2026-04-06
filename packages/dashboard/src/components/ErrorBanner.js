import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Shared error banner component.
 * Replaces the duplicated error display pattern across pages.
 */
export function ErrorBanner({ message }) {
    return (_jsx("div", { className: "rounded-[--radius-sm] border border-red-300 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400", children: message }));
}
