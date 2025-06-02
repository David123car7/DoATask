# DoATask

**DoATask** is a web platform that centralizes, organizes, and promotes volunteer opportunities within local communities. The platform enables users to create and manage tasks, join communities, engage in volunteer actions, and earn points and virtual coins as rewards.
> **Academic Context**  
> This application was developed as part of the “Software Development Project” course in the second year of the degree in Computer Systems Engineering (Licenciatura em Engenharia de Sistemas Informáticos) at Instituto Politécnico do Cávado e do Ave.

## 🧩 Key Features

- ✅ Create, accept, and complete **volunteer tasks**
- 👥 Join and manage **communities**
- 🛒 Earn and spend **virtual coins** in the community shop
- 💬 Automatic rewards system: coins and points
- 🔐 Secure login with **Supabase Auth**
- 🖼️ File and image storage via **Supabase Storage**

## 🛠️ Technologies Used

| Layer      | Tech Stack                   |
|------------|------------------------------|
| Frontend   | [Next.js](https://nextjs.org/) (React) |
| Backend    | [NestJS](https://nestjs.com/) + [Prisma](https://www.prisma.io/) |
| Database   | PostgreSQL (via [Supabase](https://supabase.com/)) |
| Auth/File Storage | Supabase Auth & Storage |

---

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/David123car7/doatask.git
```
```bash
# Install frontend & backend dependencies
npm install
```
```bash
# Set up environment variables
copy .env.sample
```
```bash
# Start backend (NestJS)
npm run start:dev
```
```bash
# Start frontend (Next.js)
npm run next dev
```

