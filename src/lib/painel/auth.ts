// Autenticação DEMO. Estrutura pensada para trocar por auth real depois:
//
//  - PRODUÇÃO (NextAuth/Auth.js): substituir `entrar` pelo provider de
//    credenciais/OAuth e `obterSessao` por `auth()`; o cookie passa a ser
//    gerenciado pela biblioteca.
//  - PRODUÇÃO (Supabase Auth): `entrar` chama `supabase.auth.signInWithPassword`,
//    `obterSessao` usa `supabase.auth.getUser()` com @supabase/ssr e o
//    clienteId vem da tabela `usuarios` (ver RLS em docs/painel/SCHEMA.md).
//
// O resto do app só usa `obterSessao`, `exigirSessao`, `entrar` e `sair`.
import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lerDb } from "./db";
import type { Cliente, Usuario } from "./types";

export const COOKIE_SESSAO = "painel_session";
const DURACAO_SEG = 60 * 60 * 12;

// DEMO: em produção, definir PAINEL_SESSION_SECRET no ambiente.
const SEGREDO = process.env.PAINEL_SESSION_SECRET ?? "segredo-local-apenas-para-demo";

function assinar(valor: string): string {
  return createHmac("sha256", SEGREDO).update(valor).digest("base64url");
}

function montarToken(usuarioId: string): string {
  const expira = Math.floor(Date.now() / 1000) + DURACAO_SEG;
  const corpo = `${usuarioId}.${expira}`;
  return `${corpo}.${assinar(corpo)}`;
}

function lerToken(token: string | undefined): string | null {
  if (!token) return null;
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [usuarioId, expira, assinatura] = partes;
  const esperado = Buffer.from(assinar(`${usuarioId}.${expira}`));
  const recebido = Buffer.from(assinatura);
  if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return null;
  if (Number(expira) < Date.now() / 1000) return null;
  return usuarioId;
}

export interface Sessao {
  usuario: Pick<Usuario, "id" | "nome" | "email" | "papel">;
  cliente: Pick<Cliente, "id" | "nomeEmpresa">;
}

export async function obterSessao(): Promise<Sessao | null> {
  const usuarioId = lerToken((await cookies()).get(COOKIE_SESSAO)?.value);
  if (!usuarioId) return null;
  const db = await lerDb();
  const usuario = db.usuarios.find((u) => u.id === usuarioId);
  const cliente = usuario && db.clientes.find((c) => c.id === usuario.clienteId);
  if (!usuario || !cliente) return null;
  return {
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    cliente: { id: cliente.id, nomeEmpresa: cliente.nomeEmpresa },
  };
}

/** Para páginas e ações: sem sessão válida, manda para o login. */
export async function exigirSessao(): Promise<Sessao> {
  const sessao = await obterSessao();
  if (!sessao) redirect("/painel/login");
  return sessao;
}

/** Valida e-mail/senha e grava o cookie. Retorna false se as credenciais não conferem. */
export async function entrar(email: string, senha: string): Promise<boolean> {
  const db = await lerDb();
  const usuario = db.usuarios.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  // DEMO: comparação com a senha de demonstração do seed. Em produção, hash (bcrypt/argon2) ou provedor externo.
  if (!usuario || usuario.senhaDemo !== senha) return false;
  (await cookies()).set(COOKIE_SESSAO, montarToken(usuario.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_SEG,
  });
  return true;
}

export async function sair(): Promise<void> {
  (await cookies()).delete(COOKIE_SESSAO);
}
