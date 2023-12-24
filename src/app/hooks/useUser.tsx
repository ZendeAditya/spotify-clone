import { User } from "@supabase/auth-helpers-nextjs";
import { Subscription, userDetails } from "../../../types";
import { createContext, useContext, useEffect, useState } from "react";
import {
  useSessionContext,
  useUser as useSuperUser,
} from "@supabase/auth-helpers-react";
import { error } from "console";

type userContextType = {
  accessToke: string | null;
  user: User | null;
  userDetails: userDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<userContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: superbase,
  } = useSessionContext();
  const user = useSuperUser();

  const accessToke = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<userDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const getUserDetails = () => superbase.from("User").select("*").single();
  const getSubscription = () =>
    superbase
      .from("subscription")
      .select("*,prices(*,products(*))")
      .in("status", ["srialing", "active"])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results: any) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === "fullfilled") {
            setUserDetails(userDetailsPromise.value.data as userDetails);
          }
          if (subscriptionPromise.status === "fullfilled") {
            setSubscription(subscriptionPromise.value.data as Subscription);
          }
          setIsLoadingData(false);
        }
      );
    } else if (!user && !isLoadingData && !isLoadingUser) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);
  const value = {
    accessToke,
    user,
    userDetails,
    isLoading: isLoadingData || isLoadingUser,
    subscription,
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a MyUserContextProvider");
  }
  return context;
};
