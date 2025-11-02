// src/setupAxios.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const setupAxios = () => {
  const mock = new MockAdapter(axios, { delayResponse: 500 });

  mock.onPost('/api/login').reply((config) => {
    const data = JSON.parse(config.data);
    if (data.email === 'test@example.com' && data.password === 'password') {
      return [
        200,
        {
          token: 'mock-auth-token-123',
          user: { name: 'Test Kullanıcısı', email: 'test@example.com' },
        },
      ];
    }
    return [
      401,
      { message: 'Geçersiz e-posta veya şifre!' },
    ];
  });
};

export default setupAxios;