import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseEditor from './pages/CourseEditor';
import CoursePreview from './pages/CoursePreview';
import ScormEngine from './pages/ScormEngine';
import MockLMS from './pages/MockLMS';
import AIAssistant from './pages/AIAssistant';
import Admin from './pages/Admin';

function App() {
  const store = useStore();

  if (!store.currentUser) {
    return <Login store={store} />;
  }

  return (
    <BrowserRouter>
      <Layout store={store}>
        <Routes>
          <Route path="/" element={<Dashboard store={store} />} />
          <Route path="/courses" element={<Courses store={store} />} />
          <Route path="/courses/:courseId/edit" element={<CourseEditor store={store} />} />
          <Route path="/courses/:courseId/preview" element={<CoursePreview store={store} />} />
          <Route path="/scorm" element={<ScormEngine store={store} />} />
          <Route path="/mock-lms" element={<MockLMS store={store} />} />
          <Route path="/ai" element={<AIAssistant store={store} />} />
          <Route path="/admin" element={<Admin store={store} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
