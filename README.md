# eecs4413-final-project

# Setup:

1. Clone to repo.
2. Fill in .env.local and rename it to .env
3. Start project using "npm run dev"

# Tools used: 

1. [Next.js](https://nextjs.org/docs) (framework)
2. [Shadcn](https://ui.shadcn.com/docs) (Design Componenets)
3. Postgres: hosted on neon.tech (Database)
4. [Prisma](https://www.prisma.io/docs/orm/prisma-client/queries/crud): (database orm)
4. [next-auth](https://authjs.dev/getting-started) (auth helper)
5. [TRPC](https://trpc.io/docs/getting-started) (API routes for Next.js)

# Major Components of Project: 

- [X] Register (sign up), Sign in, sign out
    - [X] Register (Yusuf)
    - [X] Sign in (Yusuf)
    - [] Sign out

### Customer Side
- [] List catalogue items
- [] Sort items by prices, names
- [] Filter catalog items by categories, brand, model
- [] View details (description, brand, price etc) of a product
- [] Add items to shopping cart
- [] Edit or remove items from the shopping cart
- [] “Check out” by providing credit card information and shipping information to purchase
the items in the shopping cart
- [] Maintain profile including personal info as well as purchase history

### Administrators Side:
- [] Maintain sales history.
- [] Maintain inventory.
- [] Maintain user accounts.