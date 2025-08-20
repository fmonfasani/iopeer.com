import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./hooks/useIopeer', () => ({
  useIopeer: () => ({
    connectionStatus: 'connected',
    agents: [],
    systemHealth: {},
    loading: false,
    error: null,
    connect: jest.fn(),
  }),
}));

beforeEach(() => {
  localStorage.clear();
});

test('redirects unauthenticated users to login', async () => {
  window.history.pushState({}, '', '/dashboard');
  render(<App />);
  expect(await screen.findByText(/Iopeer/i)).toBeInTheDocument();
});

test('allows access to protected route when authenticated', async () => {
  localStorage.setItem('token', 'fake');
  localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
  window.history.pushState({}, '', '/dashboard');
  render(<App />);
  expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
});
