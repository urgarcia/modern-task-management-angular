import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard'
import { AuthState } from '../state/auth.state';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authStateMock: jasmine.SpyObj<AuthState>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authStateMock = jasmine.createSpyObj('AuthState', ['getAuthState']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthState, useValue: authStateMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow access if authenticated', () => {
    authStateMock.getAuthState.and.returnValue(true);

    expect(guard.canActivate()).toBeTrue();
  });

  it('should deny access and redirect if not authenticated', () => {
    authStateMock.getAuthState.and.returnValue(false);

    expect(guard.canActivate()).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});