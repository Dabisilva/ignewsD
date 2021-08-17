import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { SessionProps } from "../../pages/posts/[slug]";
import { api } from "../../services/api";
import { getStripejS } from "../../services/stripe-js";

import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();
  const sessionSubscription = session as SessionProps;
  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (sessionSubscription.activeSubscription) {
      router.push("/posts");

      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripejS();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(`Erro ${err.message}`);
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
