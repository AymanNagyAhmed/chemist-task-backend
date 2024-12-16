"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const salt = await bcryptjs.genSalt(10);
    const locations = [
        {
            locationName: 'Sydney',
        },
        {
            locationName: 'Melbourne',
        },
        {
            locationName: 'Brisbane',
        },
        {
            locationName: 'Adelaide',
        },
        {
            locationName: 'Perth',
        },
    ];
    const createdLocations = await Promise.all(locations.map(location => prisma.preferredLocation.create({
        data: location,
    })));
    const programmingSkills = [
        { name: 'React' },
        { name: 'Angular' },
        { name: 'C#' },
        { name: 'Java' },
        { name: 'Ruby' },
        { name: 'Python' },
    ];
    const createdSkills = await Promise.all(programmingSkills.map(skill => prisma.programmingSkill.create({
        data: skill,
    })));
    const users = [
        {
            email: 'admin@test.com',
            password: await bcryptjs.hash('123456789', salt),
            fullName: 'Admin User',
            dateOfBirth: new Date('1990-01-01'),
            resumeSummary: 'Experienced full-stack developer with expertise in React and Angular.',
            preferredLocationId: createdLocations[0].id,
            programmingSkills: {
                create: [
                    { programmingSkillId: createdSkills[0].id },
                    { programmingSkillId: createdSkills[1].id },
                ],
            },
        },
        {
            email: 'user2@test.com',
            password: await bcryptjs.hash('123456789', salt),
            fullName: 'Regular User',
            resumeSummary: 'Junior developer focusing on backend development with C#.',
            programmingSkills: {
                create: [
                    { programmingSkillId: createdSkills[2].id },
                ],
            },
        },
        {
            email: 'user3@test.com',
            password: await bcryptjs.hash('123456789', salt)
        },
        {
            email: 'user4@test.com',
            password: await bcryptjs.hash('123456789', salt)
        },
    ];
    console.log('Start seeding users...');
    for (const user of users) {
        const createdUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user,
        });
        console.log(`Created user with email: ${createdUser.email}`);
    }
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map