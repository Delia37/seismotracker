# Earthquake exposed buildings

[!] Make sure that you have [Docker](https://docs.docker.com/get-docker/) and
[Docker-Compose](https://docs.docker.com/compose/install/) installed.

## Building Docker images and starting the containers

```shell
docker-compose --profile all build
docker-compose --profile be up -d
```

- `-d` / `--detach` flag is used in order to run the containers in background,
  you can run without -d if you want to see the output of the react/nest
  server. It is useful for debugging.

## Starting the servers
[!] When you start the `backend` server for the first time, please migrate
the database (the script is located in the `backend` folder):
```shell
./initial_migrate.sh
```
[!] If somehow, the seed script is not automatically called at the migration,
seed it manually:
```shell
docker-compose exec backend npx prisma db seed
```
- Start the backend with the script available in the `backend` folder:
```shell
./start_be.sh
```

- Start the frontend with the script available in the `frontend` folder:
```shell
./start_fe.sh
```

- The backend server runs on http://localhost:3000 and the frontend server on
  http://localhost:3001. (This can be customized in the config files)

- Logs are also available:
```shell
docker-compose logs -f <SERVICE_NAME>
```

- For a prettier way to display the loaded data, the `backend` container also
exposes the port `5555` and `prisma studio` can be used:
```shell
docker-compose exec backend npx prisma studio
```
A server should be started on http://localhost:5555.

## Pre-commit hooks

- [Husky](https://typicode.github.io/husky/#/) enables use to run pre-commit
  hooks. Currently, lint-staged will run [prettier](https://prettier.io/) on modified files and [ESLint](https://eslint.org/)
  will verify them.
- For backend a plugin for NestJS is used: [@darraghor/eslint-plugin-nestjs-typed](https://github.com/darraghoriordan/eslint-plugin-nestjs-typed).
- In order to be able to commit, the container(s) must be up, otherwise it
  will fail.
