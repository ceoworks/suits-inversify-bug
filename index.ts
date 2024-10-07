import 'reflect-metadata';
import {injectable, inject} from "inversify";
import {TestBed} from "@suites/unit"


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

async function main() {
    const {unit, unitRef} = await TestBed.sociable(UserService).expose(UserApi).compile();
    
    const underTest = unit;    
    let database = unitRef.get(Database);
    let httpService = unitRef.get(HttpService);

    const userFixture: User = { id: 1, name: 'John' };

    // Mock the HttpService dependency
    httpService.get.mockResolvedValue({ data: userFixture });
    database.saveUser.mockResolvedValue(userFixture.id);

    const result = await underTest.generateRandomUser();
}

main();



