import { useQuery } from "@tanstack/react-query";
import { logementsApi } from "../api/logements";

export const useLogements = () =>
  useQuery({ queryKey: ["logements"], queryFn: () => logementsApi.list() });

export const useLogement = (id: number) =>
  useQuery({ queryKey: ["logement", id], queryFn: () => logementsApi.get(id), enabled: !!id });
