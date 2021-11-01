import dotenv from "dotenv";
dotenv.config();

export = {
  type: "mongodb",
  // database: "database.sqlite",
  url: 'mongodb+srv://admin:freeonboarding@onboarding.mv6lu.mongodb.net/aimmo?retryWrites=true&w=majority',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  seeds: ['src/app/database/seeds/**/*.seed.ts'],
  entities: ["src/app/entity/**/*.ts"],
  migrations: ["src/app/migration/**/*.ts"],
  subscribers: ["src/app/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/app/entity",
    migrationsDir: "src/app/migration",
    subscribersDir: "src/app/subscriber",
  },
};

