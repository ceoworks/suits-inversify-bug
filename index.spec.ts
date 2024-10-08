import 'reflect-metadata';
import {injectable, inject} from "inversify";
import {Mocked, TestBed} from "@suites/unit"


export interface User {
    id: number;
    name: string;
}
  
export interface IncomingEvent {
    type: string;
    data: unknown;
}

const enum DI {
    UserApi = "UserApi",
    HttpService = "HttpService",
    Database = "Database",
    UserService = "UserService"
}

@injectable()
export class HttpService {
  async get(url: string): Promise<unknown> { console.log(`request: ${url}`); return; }
}

@injectable()
export class UserApi {
  constructor(
    @inject(DI.HttpService)
    private http: HttpService
) {}


  async getRandom(): Promise<User> {
    const response = await this.http.get('/random-user');
    return response as User;
  }
}

@injectable()
export class Database {
  async saveUser(user: User): Promise<number> { console.log(`user: ${user}`); return 1; }
}

@injectable()
export class UserService {
  constructor(
    @inject(DI.UserApi)
    private userApi: UserApi, 
    @inject(DI.Database)
    private database: Database) {}

  async generateRandomUser(): Promise<number | boolean> {
    try {
      const user = await this.userApi.getRandom();
      return this.database.saveUser(user);
    } catch (error) {
      return false;
    }
  }
}

describe('sociable', () => {
  let underTest: UserService;
  let database: Mocked<Database>;
  let httpService: Mocked<HttpService>;
  beforeAll(async () => {
    const {unit, unitRef} = await TestBed.sociable(UserService).expose(DI.UserApi as never).compile();
    underTest = unit;    
    database = unitRef.get(DI.Database);
    httpService = unitRef.get(DI.HttpService);
  });

  it('should work', async () => {
    const userFixture: User = { id: 1, name: 'John' };

    // Mock the HttpService dependency
    httpService.get.mockResolvedValue({ data: userFixture });
    database.saveUser.mockResolvedValue(userFixture.id);

    const result = await underTest.generateRandomUser();

    expect(httpService.get).toHaveBeenCalledWith('/random-user/');
    expect(database.saveUser).toHaveBeenCalledWith(userFixture);
  });
});



