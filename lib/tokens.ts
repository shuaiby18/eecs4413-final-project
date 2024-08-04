import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { email },
        });

        return verificationToken;
    } catch {
        return null;
    }
};

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const verficationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verficationToken;
};

