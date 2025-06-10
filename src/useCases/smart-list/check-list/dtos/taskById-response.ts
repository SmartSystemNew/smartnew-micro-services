import { $Enums } from '@prisma/client';

export interface TaskByIdResponse {
  id: number;
  observation: string;
  images: {
    url: string;
  }[];
  error: {
    message: string;
  } | null;
  answer: {
    id: number;
    type: string;
    description: string;
    color: $Enums.smartnewsystem_producao_checklist_status_cor;
    icon: string;
    child: object;
  };
  options: {
    id: number;
    type: string;
    description: string;
    color: string;
    icon: string;
    action: boolean;
    children:
      | {
          // type: string;
          id: number;
          description: string;
        }[]
      | null;
  }[];
}
