`npx prisma generate` cria modulos para tabelas adicionadas no **schema.prisma**
(Ao ser corrido o migrate dev é corrido automaticamente o prisma generate)

Utilizar o comando: `npx prisma migrate dev` sempre que for adicionado tabelas á base de dados no **schema.prisma** e sempre que for presiso voltar a correr o comando é preciso utilizar o comando `npx prisma migrate reset`

Obs: No ficheiro env o `DATABASE_URL="mysql://root:123@localhost:3306/DoATaskDB"` para ser possivel realizar o migrate foi preciso colocar como root

ondelete cascate??? para eliminar todas as relações