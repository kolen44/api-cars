rabbit

```bash
docker run -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=myuser -e RABBITMQ_DEFAULT_PASS=mypassword -d rabbitmq:3-management
```

docker

```bash
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_DB=database_name -p 5432:5432 -d postgres
```
