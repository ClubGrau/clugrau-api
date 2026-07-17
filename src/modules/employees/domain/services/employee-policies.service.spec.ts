import { FindEmployeeByEmailPort } from '@modules/employees/application/ports/outbound/find-employee-by-email.port';
import { EmployeePoliciesService } from './employee-policies.service';

const makeStubs = () => ({
  findEmployeeByEmailStub: {
    findByEmail: jest.fn().mockResolvedValue(null),
  } satisfies FindEmployeeByEmailPort,
});

const makeSut = (): SutTypes => {
  const { findEmployeeByEmailStub } = makeStubs();
  const sut = new EmployeePoliciesService(findEmployeeByEmailStub);
  return { sut, findEmployeeByEmailStub };
};

type SutTypes = {
  sut: EmployeePoliciesService;
  findEmployeeByEmailStub: FindEmployeeByEmailPort;
};

describe('EmployeePoliciesService', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(EmployeePoliciesService);
  });

  it('should call findEmployeeByEmail with correct email', async () => {
    const { sut, findEmployeeByEmailStub } = makeSut();
    const email = 'test@example.com';
    const findByEmailSpy = jest.spyOn(findEmployeeByEmailStub, 'findByEmail');
    await sut.checkEmployee(email);
    expect(findByEmailSpy).toHaveBeenCalledWith(email);
  });
});
