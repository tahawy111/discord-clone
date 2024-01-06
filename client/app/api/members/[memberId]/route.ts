import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await getAuthSession();
    const { role } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });

    if (!params.memberId)
      return new NextResponse("MEMBER ID Missing", { status: 400 });
    if (!serverId)
      return new NextResponse("SERVER ID Missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: session.user.id,
      },
      data: {
        members: {
          update: {
            where: { id: params.memberId, userId: { not: session.user.id } },
            data: { role },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
      const { searchParams } = new URL(req.url);
      const session = await getAuthSession();
      const serverId = searchParams.get("serverId");

      if (!session?.user) {
        return new NextResponse("Unauthorized" ,{ status: 401 });
      }

      if (!serverId) {
        return new NextResponse("Server ID missing", { status: 400 });
      }

      if (!params.memberId) {
        return new NextResponse("Member ID missing", { status: 400 });
      }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: session.user.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            userId: {
              not: session.user.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_DELETE]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

// export async function DELETE(
//     req: Request,
//     { params }: { params: { memberId: string } }
//   ) {
//     try {
//       const { searchParams } = new URL(req.url);
//       const session = await getAuthSession();
//       const serverId = searchParams.get("serverId");

//       if (!session?.user) {
//         return new NextResponse("Unauthorized" ,{ status: 401 });
//       }

//       if (!serverId) {
//         return new NextResponse("Server ID missing", { status: 400 });
//       }

//       if (!params.memberId) {
//         return new NextResponse("Member ID missing", { status: 400 });
//       }

//       const server = await db.server.update({
//         where: {
//           id: serverId,
//           userId: session.user.id,
//         },
//         data: {
//           members: {
//             deleteMany: {
//               id: params.memberId,
//               userId: {
//                 not: session.user.id
//               }
//             }
//           }
//         },
//         include: {
//           members: {
//             include: {
//               user: true,
//             },
//             orderBy: {
//               role: "asc",
//             }
//           },
//         },
//       });

//       return NextResponse.json(server);
//     } catch (error) {
//       console.log("[MEMBER_ID_DELETE]", error);
//       return new NextResponse("Internal Error", { status: 500 });
//     }
//   }
