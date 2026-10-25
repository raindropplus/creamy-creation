import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User } from "@/database/models";
import { createSession } from "@/lib/auth";
import { normalizeIdentifier } from "@/lib/identity";

export async function POST(request: Request) {
  const body = await request.json();
  const identifier = normalizeIdentifier(String(body.identifier || ""));
  const password = String(body.password || "");

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email/mobile number and password are required." },
      { status: 400 }
    );
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    },
  });

  if (
    !user ||
    !user.isActive ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    return NextResponse.json(
      { error: "Invalid email/mobile number or password." },
      { status: 401 }
    );
  }

  await createSession({
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
  });

  return NextResponse.json({ ok: true, role: user.role });
}
