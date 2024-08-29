# eecs4413-final-project

#
The following NextJS project is an e-commerce website that will connect artists and clients in order to sell 3D models to customers ranging from a wide variety of categories such as cars, environments, planes, animals, and characters. It provides user authentication, product management, shopping cart, checkout process, order management, and admin features. It utilizes complex ThreeJS model rendering to provide real time interactivity in the searchResults page. The project is deployed utilizing vercel, database management is carried out through neon DB, and authentication is handeled through NextAuth.

# LIVE LINK: 
https://eecs4413-final-project-git-new-models-router-eecs-4413.vercel.app/ 

# SETUP:
UTILIZE THE NEW-MODELS-ROUTER BRANCH AND NOT THE MAIN BRANCH AS IT IS OUTDATED
1. Clone to repo.
2. Fill in .env.local and rename it to .env
3. run the seed command 'npm run seed'
4. Start project using "npm run dev"

# TOOLS USED: 

1. [Next.js](https://nextjs.org/docs) (framework)
2. ThreeJS (Design Componenets)
3. Postgres: hosted on neon.tech (Database)
4. [Prisma](https://www.prisma.io/docs/orm/prisma-client/queries/crud): (database orm)
4. [next-auth](https://authjs.dev/getting-started) (auth helper)
5. [TRPC](https://trpc.io/docs/getting-started) (API routes for Next.js)

### Customer Side
- [X] List catalogue items
- [X] Sort items by prices, names
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
