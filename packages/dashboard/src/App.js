import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { Overview } from './pages/Overview.tsx';
import { Projects } from './pages/Projects.tsx';
import { Project } from './pages/Project.tsx';
import { NewProject } from './pages/NewProject.tsx';
import { GraphGlobal } from './pages/GraphGlobal.tsx';
import { Graph } from './pages/Graph.tsx';
import { Infrastructure } from './pages/Infrastructure.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { TerminalPage } from './pages/TerminalPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { AnalysisPage } from './pages/AnalysisPage.tsx';
import { ConformancePage } from './pages/ConformancePage.tsx';
import { ChangelogPage } from './pages/ChangelogPage.tsx';
import { OnboardingPage } from './pages/OnboardingPage.tsx';
import { GraphDiff } from './pages/GraphDiff.tsx';
import { PipelinePage } from './pages/PipelinePage.tsx';
export function App() {
    return (_jsxs(BrowserRouter, { children: [_jsx(CommandPalette, {}), _jsx(Routes, { children: _jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Overview, {}) }), _jsx(Route, { path: "/projects", element: _jsx(Projects, {}) }), _jsx(Route, { path: "/projects/:id", element: _jsx(Project, {}) }), _jsx(Route, { path: "/new-project", element: _jsx(NewProject, {}) }), _jsx(Route, { path: "/graph", element: _jsx(GraphGlobal, {}) }), _jsx(Route, { path: "/graph/diff", element: _jsx(GraphDiff, {}) }), _jsx(Route, { path: "/graph/:id", element: _jsx(Graph, {}) }), _jsx(Route, { path: "/analysis", element: _jsx(AnalysisPage, {}) }), _jsx(Route, { path: "/conformance", element: _jsx(ConformancePage, {}) }), _jsx(Route, { path: "/changelog", element: _jsx(ChangelogPage, {}) }), _jsx(Route, { path: "/onboarding", element: _jsx(OnboardingPage, {}) }), _jsx(Route, { path: "/onboarding/:projectId", element: _jsx(OnboardingPage, {}) }), _jsx(Route, { path: "/pipeline", element: _jsx(PipelinePage, {}) }), _jsx(Route, { path: "/infrastructure", element: _jsx(Infrastructure, {}) }), _jsx(Route, { path: "/search", element: _jsx(SearchPage, {}) }), _jsx(Route, { path: "/terminal", element: _jsx(TerminalPage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) })] }) })] }));
}
