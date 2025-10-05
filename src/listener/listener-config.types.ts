export type ListenerConfigType = {
  chains: {
    id: number;
    name: string;
    rpcURL: string;
    events: {
      name: string;
      abi: string;
      contract: string;
    }[];
  }[];
};
