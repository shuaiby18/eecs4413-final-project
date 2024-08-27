//Importing the feth request handlers from the TRPC fetch pakage
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

//imorting app router to help define routes 
import { appRouter } from "@/server";


//Responsible for handling POST and GET requests 
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

//Eporting created handler to be used for POST and GET requests so that it can be used with TRPC
export { handler as GET, handler as POST }