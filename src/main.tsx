import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { AppProvider } from './state';
import { Shell } from './components/Shell';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Canvas } from './pages/Canvas';
import { Question } from './pages/Question';
import { EventDetail, Events, NewEvent } from './pages/Events';
import { Library } from './pages/Library';
import { Edit } from './pages/Edit';
import './styles.css';

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/canvas', element: <Canvas /> },
      { path: '/canvas/explore', element: <Navigate to="/canvas" replace /> },
      { path: '/canvas/:qid', element: <Question /> },
      { path: '/events', element: <Events /> },
      { path: '/events/new', element: <NewEvent /> },
      { path: '/events/:eid', element: <EventDetail /> },
      { path: '/library', element: <Library /> },
      { path: '/edit', element: <Edit /> },
      { path: '*', element: <Home /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
