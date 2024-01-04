import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
//db에 등록된 값이 있는지 주의

async function main() {
  [...Array.from(Array(5).keys())].forEach(async (item) => {
    await client.user.create({
      data: {
        name: "test" + String(item),
        password: "password",
        email: "email" + String(item),
        posts: {
          create: [
            {
              title: "title",
              content: "content",
              published: true,
            },
          ],
        },
      },
      include: {
        posts: true,
      },
    });
    console.log(`${item}/5`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect);
