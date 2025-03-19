import {Test} from "@nestjs/testing"
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum"
import { AuthDtoSignup } from "../src/auth/dto";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async() => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe("auth", () => {
    describe("signup", () => {
      const dto: AuthDtoSignup = {
        email: "ola1234@gmail.com",
        password: "123",
        name: "david",
        dateBirth: "2025-03-18T19:29:22.247Z"
      }
      it("should sign up", () => {
        return pactum.spec().post("/auth/signup").withBody({
          email: dto.email,
          password: dto.password,
          name: dto.password,
          dateBirth: dto.dateBirth,
        }
        ).expectStatus(201).inspect();  
      });
    });
  });
});
