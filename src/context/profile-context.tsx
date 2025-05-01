import { createContext, useState } from "react";
type Profile = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        country: string;
        zip: string;
        role: string;
        createdAt: string;
        updatedAt: string;
    };
  };
  export const ProfileContext = createContext<Profile | null>(
    {} as Profile | null
  );
  export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<Profile["user"] | null>(null);
    return (
      <ProfileContext.Provider value={{ token, setToken, user, setUser }}>
        {children}
      </ProfileContext.Provider>
    );
  }
  