import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrgState {
  organizationId: string | null;
  memberId: string | null;
  locationId: string | null;
  locationName: string | null;
  address: string | null;
  logo: string | null;
  taxRate: string | null;
  currency: string;
  orgName: string | null;
  plan: string | null;
  set: (state: Partial<OrgState>) => void;
  clear: () => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      organizationId: null,
      memberId: null,
      locationId: null,
      locationName: null,
      address: null,
      logo: null,
      taxRate: null,
      currency: "USD",
      orgName: null,
      plan: null,
      set: (state: Partial<OrgState>) => set(state),
      clear: () =>
        set({
          organizationId: null,
          memberId: null,
          locationId: null,
          locationName: null,
          address: null,
          logo: null,
          taxRate: null,
          currency: "USD",
          orgName: null,
          plan: null,
        }),
    }),
    {
      name: "org-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          localStorage.removeItem(name);
        },
      },
    }
  )
);
