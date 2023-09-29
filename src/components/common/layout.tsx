import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
}

export function Layout({ pageTitle, children }: LayoutProps) {
  const session = useSession();

  return (
    <>
      <Head>
        <title>{`${pageTitle} - Quiz.io`}</title>
      </Head>
      <div className="min-h-screen flex flex-col px-40">
        <nav className="flex items-center justify-between pt-6 py-2 border-b border-slate-200 px-1">
          <Link href="/">
            <a className="text-2xl text-indigo-800 font-bold">Quiz.io</a>
          </Link>

          {!session.data?.user ? (
            <button
              onClick={() => signIn("google")}
              className="text-indigo-800 text-sm font-semibold"
            >
              Log in
            </button>
          ) : (
            <div className="flex divide-x-2 gap-4">
              {session.data?.user?.name && (
                <span className="text-slate-600 text-sm font-semibold">
                  {session.data.user.name}
                </span>
              )}

              <div className="pl-4 flex">
                <button
                  onClick={() => signOut()}
                  className="text-indigo-800 text-sm font-semibold"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </nav>
        {children}
        <footer className="py-6 flex border-t border-slate-200">
          <span className="text-slate-600 text-sm ml-auto">
            Copyright &copy; 2023 - Quiz.io
          </span>
        </footer>
      </div>
    </>
  );
}
