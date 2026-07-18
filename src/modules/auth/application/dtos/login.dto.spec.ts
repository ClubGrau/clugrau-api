import { LoginDto, LoginResultDto } from './login.dto';

describe('LoginDto', () => {
  it('should describe the login use case input', () => {
    const dto: LoginDto = {
      email: 'john@example.com',
      password: '123456',
    };

    expect(dto).toBeDefined();
    expect(dto.email).toBe('john@example.com');
    expect(dto.password).toBe('123456');
  });
});

describe('LoginResultDto', () => {
  it('should describe a result carrying the created employee id', () => {
    const result: LoginResultDto = {
      token: 'valid_token',
    };

    expect(result).toBeDefined();
    expect(result.token).toBe('valid_token');
  });
});
