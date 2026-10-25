import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User } from "@/database/models";
import { createSession } from "@/lib/auth";
import {
  isEmail,
  isPhone,
  normalizeIdentifier,
} from "@/lib/identity";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const identifier = normalizeIdentifier(String(body.identifier || ""));
  const password = String(body.password || "");

  if (!name || !identifier || password.length < 8) {
    return NextResponse.json(
      { error: "Name, email/mobile, and a password of at least 8 characters are required." },
      { status: 400 }
    );
  }

  const email = isEmail(identifier) ? identifier : null;
  const phone = !email && isPhone(identifier) ? identifier : null;

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Enter a valid email address or mobile number." },
      { status: 400 }
    );
  }

  const exists = await User.findOne({
    where: {
      [Op.or]: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  if (exists) {
    return NextResponse.json(
      { error: email ? "Email already registered." : "Mobile number already registered." },
      { status: 409 }
    );
  }

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash: await bcrypt.hash(password, 12),
    role: "CUSTOMER",
    isActive: true,
  });

  await createSession({
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
  });

  return NextResponse.json({ ok: true });
}
