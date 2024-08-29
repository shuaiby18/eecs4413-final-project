# EECS 4413 FINAL PROJECT



# Project Description
The following NextJS project is an e-commerce website that will connect artists and clients in order to sell 3D models to customers ranging from a wide variety of categories such as cars, environments, planes, animals, and characters. It provides user authentication, product management, shopping cart, checkout process, order management, and admin features. It utilizes complex ThreeJS model rendering to provide real time interactivity in the searchResults page. The project is deployed utilizing vercel, database management is carried out through neon DB, and authentication is handeled through NextAuth.

# Live Vercel Deployment Link
https://eecs4413-final-project-git-new-models-router-eecs-4413.vercel.app/ 

# IMPORTANT: UTILIZE ONLY THE NEW-MODELS-ROUTER BRANCH AND NOT THE MAIN BRANCH AS IT IS OUTDATED

The new-model-router branch is the most current branch that is connected to vercel. Clone this branch in order to see the most current code to test locally. Alternatively, you can clone the temp-new-models-router branch to test the code locally as well. DO NOT TOUCH OR CLONE THE MAIN BRANCH.

# Setup:
1. Clone the repository by going to the new-models-router branch 
2. Execute 'npm install' in order to download all the dependencies
3. Execute 'npm run dev' in order to start the code on local branch (localhost:3000)
4. If issues arrive with prisma, simply do the following commands:
   a) npm install @prisma/client
   b) npx prisma generate
   c) npx prisma db pull
   d) npm run seed

# Tools Used: 
1. [Next.js](https://nextjs.org/docs) (framework)
2. ThreeJS and react-three/drei (Design Componenets)
3. Postgres: hosted on neon.tech (Database)
4. [Prisma](https://www.prisma.io/docs/orm/prisma-client/queries/crud): (database orm)
4. [next-auth](https://authjs.dev/getting-started) (auth helper)
5. [TRPC](https://trpc.io/docs/getting-started) (API routes for Next.js)
