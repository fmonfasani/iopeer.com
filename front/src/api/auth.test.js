import { signupRequest, passwordResetRequest } from './auth';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'ok' })
  })
);

describe('auth api', () => {
  beforeEach(() => {
    fetch.mockClear();
    process.env.REACT_APP_API_URL = 'http://localhost:8000';
  });

  test('signupRequest posts JSON body to /signup', async () => {
    await signupRequest('a@b.com', 'x');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/signup',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'a@b.com', password: 'x' })
      })
    );
  });

  test('passwordResetRequest posts to /reset-password', async () => {
    await passwordResetRequest('a@b.com');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/reset-password',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
