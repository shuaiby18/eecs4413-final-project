import { DefaultUser } from 'next-auth';
import { DefaultJWT } from "next-auth/jwt";

declare module 'next-auth' {
    interface Session {
        user: DefaultUser & { id: string; role: string; email: string };
    }

    interface User extends DefaultUser {
        role: string;
        email: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
      email: string;
      id: string; // Include other custom properties you might have
    }
  }
