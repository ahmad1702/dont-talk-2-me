declare global {
  var prisma: PrismaClient; // This must be a `var` and not a `let / const`
}

// import { PrismaClient } from "@prisma/client";
// let prisma: PrismaClient;

// // if (process.env.NODE_ENV === "production") {
// prisma = new PrismaClient();
// // } else {
// //   if (!global.prisma) {
// //     global.prisma = new PrismaClient();
// //   }
// //   prisma = global.prisma;
// // }

// export default prisma;

import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;