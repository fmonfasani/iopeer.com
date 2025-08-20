import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'token123', user: { id: 1 } }),
      })
    );
  });

  test('login stores token and user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.login('a@b.com', 'pass');
    });
    expect(result.current.isLoggedIn).toBe(true);
    expect(localStorage.getItem('token')).toBe('token123');
  });

  test('logout clears auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    act(() => {
      result.current.logout();
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
