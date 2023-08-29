import * as typeorm from "typeorm";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config();

const dataSource = new typeorm.DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "kweb",
  synchronize: true,
  entities: [
    join(__dirname, "../entity/user.ts"),
    join(__dirname, "../entity/course.ts"),
    join(__dirname, "../entity/post.ts"),
  ],
});

export default dataSource;
