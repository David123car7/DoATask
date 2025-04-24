import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthControllerTest', () => {
  let authService: AuthService;

  const mockUserService = {
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [AuthService],
      }).overrideProvider(AuthService).useValue(mockUserService).compile();

    authService = moduleRef.get(AuthService);
  }) ;

  it("should be defined", () => {
    expect(authService).toBeDefined()
  })
});
