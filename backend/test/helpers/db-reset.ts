import { PrismaService } from "../../src/prisma";

//táblák törlése
export async function resetDb(prisma: PrismaService) {
    await prisma.answer.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.question.deleteMany();
    await prisma.questionBank.deleteMany();
    await prisma.questionBankTemplate.deleteMany();
    await prisma.mediaPlatform.deleteMany();
    await prisma.media.deleteMany();
    await prisma.platform.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
}