import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!name || !email || !password)
      return new Response("Missing Info", { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image:
          "https://res.cloudinary.com/dzdqy3wfg/image/upload/v1701478265/discord-clone/tkvtbubm0fbiwnz5bqlr.jpg",
      },
    });

    return new Response(JSON.stringify(user));
  } catch (error) {
    console.log("REGISTRATION_ERROR");
    return new Response("Internal Error", { status: 500 });
  }
}
