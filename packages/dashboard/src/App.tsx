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
  return (
    <BrowserRouter>
      <CommandPalette />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/graph" element={<GraphGlobal />} />
          <Route path="/graph/diff" element={<GraphDiff />} />
          <Route path="/graph/:id" element={<Graph />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/conformance" element={<ConformancePage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/onboarding/:projectId" element={<OnboardingPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/terminal" element={<TerminalPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
