// Proxy (antigo "middleware" no Next.js 16): protege /painel/* exceto o login.
// Aqui só se verifica a presença do cookie; a assinatura é validada em
// src/lib/auth.ts (exigirSessao) em cada página e ação.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_SESSAO = "painel_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const temSessao = Boolean(request.cookies.get(COOKIE_SESSAO)?.value);

  // O login fica livre; se a sessão já for válida, a própria página redireciona
  // (aqui não dá pra validar a assinatura, e um cookie vencido causaria loop).
  if (pathname.startsWith("/painel/login")) return NextResponse.next();
  if (!temSessao) {
    return NextResponse.redirect(new URL("/painel/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/painel", "/painel/:path*"],
};
