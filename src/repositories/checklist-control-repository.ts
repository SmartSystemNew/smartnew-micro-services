import { smartnewsystem_producao_checklist_controle } from '@prisma/client';

export abstract class CheckListControlRepository {
  abstract list(): Promise<smartnewsystem_producao_checklist_controle[]>;
}
