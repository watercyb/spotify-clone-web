import {
  SignedOut,
  UserButton,
  useSignIn,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const Clerk = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  const signInWithGoogle = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso_callback",
      redirectUrlComplete: "/auth_callback",
    });
  };

  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <Button onClick={signInWithGoogle} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
			<img src='/google.png' alt='Google' className='size-5' />
			Continue with Google
		</Button>
      </SignedOut>
      <UserButton />
    </div>
  );
};

export default Clerk;
