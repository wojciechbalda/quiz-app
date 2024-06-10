import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";

export default async function AuthButtons() {
  const session = await auth();
  return (
    <>
      {!session?.user && (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <Button className="w-full lg:auto" type="submit">Sign in</Button>
        </form>
      )}
      {session?.user && (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button className="w-full lg:auto" type="submit">Log out</Button>
        </form>
      )}
    </>
  );
}
