export enum MessageService {
  //SYSTEM
  SYSTEM_FTP_IMG_ERROR_CONNECT = 'Erro a carregar imagens!',
  SYSTEM_FTP_IMG_DELETE_CONNECT = 'Erro ao excluir imagens!',
  SYSTEM_FTP_FILE_DELETE_NOT_EXISTS = 'Erro ao excluir , arquivo não encontrado!',
  SYSTEM_bank_delete = 'Erro ao deletar item!',
  SYSTEM_application_not_found = 'Aplicação não encontrada!',
  SYSTEM_not_have_permission = 'Não tem permissão para essa ação',
  SYSTEM_FILE_NOT_FOUND = 'Arquivo não enviado!',
  SYSTEM_FILE_ERROR = 'Error ao ler o arquivo!',
  INTERNAL_SERVER_ERROR = 'Erro interno do servidor!',

  // Profile
  Profile_layout_table_not_found = 'Tabela de layout não encontrada!',

  //ENV
  Database_not_found = 'DATABASE_URL não encontrada nas variáveis ambiente',
  Origin_not_found = 'ORIGIN não encontrada nas variáveis ambiente',
  Key_not_found = 'KEY não encontrada nas variáveis ambiente',
  FTP_HOST_found = 'FTP_HOST não encontrada nas variáveis ambiente',
  FTP_USER_found = 'FTP_USER não encontrada nas variáveis ambiente',
  FTP_PASS_found = 'FTP_PASS não encontrada nas variáveis ambiente',

  //Excel
  Excel_user_not_permission = 'Usuário não tem permissão para importar',

  //User
  User_not_found = 'Usuário nao encontrado!',
  Login_not_found = 'Login não Encontrado!',
  Login_lass_size = 'Login vazio ou com menos de 3 caracteres!',
  Pass_not_found = 'Senha não Encontrado!',
  Pass_lass_size = 'Senha com menos de 3 caracteres!',
  Pass_error = 'Senha incorreta',
  Login_or_pass_error = 'Login ou senha incorreto!',
  Credential_invalid = 'Credenciais inválidas!',

  // Elevation
  elevation_not_found = 'Não foi encontrado responsáveis!',

  //Check List Web
  CheckList_equipment_and_location_not_found = 'Equipamento ou Diverso não informado!',
  CheckList_turn_not_found = 'Turno não informado!',
  Production_id_not_found = 'Id Producao não encontrada',
  Production_not_found = 'Producao não encontrada',
  Production_has_action_in_checklist = 'Erro ao deletar, existe ação vinculada!',
  Query_index_missing = 'index não informado',
  Query_per_page_missing = 'perPage não informado',
  Answer_not_found = 'AnswerId não informado',
  Img_task_not_found = 'New Imagem não encontrado',
  Observation_task_not_found = 'Observação não passada',
  AnswerAction_not_found = 'ChildId não informado',
  Task_id_missing = 'taskId não informado',
  Task_not_found = 'Tarefa não encontrada!',
  Task_not_delete = 'Erro ao deletar tarefa pois ela esta vinculada a um checklist!',
  Task_id_not_found = 'Não foi encontrado um checklistPeriod com o id informado',
  UrlFile_not_found = 'FilName não encontrada',
  User_not_permission = 'Usuário sem permissão',
  CheckList_have_bound = 'Checklist já vinculado!',
  CheckList_has_action = 'Ação já gerada!',
  CheckList_model_not_found = 'Modelo de checklist não encontrado!',
  CheckList_not_found = 'Checklist não encontrado!',
  CheckListItem_have_bound = 'Checklist Item já vinculado!',

  //Task
  Task_description_not_found = 'Descrição não encontrada',
  Task_impediment_not_found = 'Impeditivo não encontrada',
  Task_controlId_not_found = 'Id Controle não encontrada',
  Task_statusAction_have_bound = 'Status já vinculado!',

  //Bound
  Bound_familyId_not_found = 'Id Familia não encontrada!',
  Bound_description_not_found = 'Descrição não encontrada!',
  Bound_family_not_found = 'Familia não encontrada!',
  Bound_location_not_found = 'Diverso não encontrada!',
  Bound_family_already_exist = 'Familia já vinculada!',
  Bound_location_already_exist = 'Diverso já vinculada!',
  Bound_taskId_not_found = 'Id Tarefa não encontrado!',
  Bound_controlId_not_found = 'Id Controle não encontrado!',

  //Buy
  Buy_id_not_found = 'Id compra não encontrado!',
  Buy_item_id_not_found = 'Id item não encontrado!',
  Buy_item_bound_not_found = 'Item vinculado não informado!',
  Buy_item_composition_not_found = 'Item composição não encontrada!',
  Buy_item_quantity_not_stock = 'Quantidade do item não existe no estoque!',
  Buy_finalize_not_user_permission = 'Erro ao finalizar, não tem permissão para finalizar!',
  Buy_item_conflict_priority_emergency = 'É necessário alterar a prioridade de todos para itens urgente!',
  Buy_not_relaunch_exists = 'Não é possível relançar pois já foi relançado!',
  Buy_not_relaunch_item_not_approved = 'Não é possível relançar pois nenhum item foi aprovado!',

  //Buy Liberation
  Buy_liberation_user_not_found = 'Não existem liberações para este usuário',

  // Elevation
  Elevation_not_found = 'Responsável não encontrado!',
  Elevation_user_not_deleted_bound_approbation = 'Erro ao excluir responsável, existem compras a serem aprovadas vinculadas!',
  Elevation_user_not_deleted_not_approbation_in_branch = 'Erro ao excluir responsável, quantidade de aprovadores menor que o limite de aprovadores!',

  //buy quotation
  Buy_quotation_not_found = 'Cotações não encontradas',
  Buy_quotation_answer_not_response = 'Erro ao finalizar,Resposta não encontrada!',
  Buy_quotation_finance_not_response = 'Erro ao finalizar, informações financeira não encontrada!',
  Buy_quotation_id_not_found = 'Id cotação não encontrada!',
  Buy_pre_finance_not_found = 'Pré financiamento não encontrado!',
  Buy_quotation_item_not_found = 'Item cotação não encontrada!',
  //Buy Quotation Item
  Buy_quotation_item_reason_or_block_not_found = 'Motivo ou bloqueio não encontrado!',

  //Buy Quotation Discount
  Buy_quotation_discount_id_not_found = 'Id desconto não encontrado!',
  Buy_quotation_discount_reason_not_found = 'Motivo não encontrado!',

  //Buy Quotation Item Block

  //Buy Control Quotation
  Buy_status_not_allowed = 'Erro ao editar , compras ja passou para aprovacao!',
  Buy_status_return_not_control_quotation = 'Esta solicitação ainda não houve fechamento!',
  Buy_status_cancelled = 'Erro ao editar, pedido de compras cancelado!',

  //Buy Approbation
  Buy_approbation_id_not_found = 'Id aprovação não encontrada!',

  //Buy Request
  Buy_request_id_not_found = 'Pedido não encontrada!',
  Buy_request_status_not_found = 'Status Pedido não encontrado!',
  Buy_request_status_item_duplicate = 'Status já lançado nesse item!',
  Buy_request_not_finalize = 'Erro ao finalizar, pedido não foi concluído!',
  Buy_request_finalize = 'Erro ao retornar, pedido tem itens entregue!',

  //CheckList Action
  ChecklistAction_groupId = 'Id Grupo não encontrada',
  ChecklistAction_itemId = 'Id item não encontrada',
  ChecklistAction_branchId = 'Id filial não encontrada!',
  ChecklistAction_title = 'Titulo não encontrada!',
  ChecklistAction_description = 'Descrição para ação não encontrada!',
  ChecklistAction_descriptionAction = 'Descrição ação não encontrada!',
  ChecklistAction_responsible = 'Responsavel ação não encontrada!',
  ChecklistAction_deadline = 'Prazo ação não encontrada!',
  ChecklistAction_doneAt = 'Data Conclusão não encontrada!',
  ChecklistAction_duplicate_item = 'Id Item já vinculado antes!',
  ChecklistAction_item_not_branch = 'Item pertence a outra filial!',

  //Diverse
  Diverse_id_not_found = 'Id não encontrado!',
  Diverse_name_item_not_found = 'Nome não encontrado!',

  //Location
  Location_not_found = 'Diverso não localizado!',
  Location_not_delete = 'Erro ao deletar, localização vinculada!',
  Location_already_exist = 'Erro ao executar, Diverso com a mesma tag registrada!',
  //Category Diverse
  Category_diverse_not_found = 'Categoria não encontrado!',

  //Finance
  FinanceItem_not_found = 'Id Item não encontrada',
  FinanceItem_item_bound_not_found = 'Item vinculado não encontrado!',
  FinanceItem_cost_center_not_found = 'Centro de Custo não encontrado',
  FinanceItem_input_not_found = 'Insumo não encontrado',
  FinanceItem_not_launch = 'Nenhum item lançado!',
  Finance_numberFiscal_not_found = 'Numero fiscal não enviado!',
  Finance_type_not_found = 'Escolha um tipo `pagar` ou `receber`',
  Finance_typeDocument_not_found = 'Tipo de documento não encontrado!',
  Finance_typePayment_not_found = 'Tipo de pagamento não encontrado!',
  Finance_issue_not_found = 'Emitente não encontrado!',
  Finance_sender_not_found = 'Remetente não encontrado!',
  Finance_key_not_found = 'Chave obrigatória não enviada!',
  Finance_duplicate = 'Lançamento já feito!',
  Finance_not_found = 'Lançamento não encontrado!',
  Finance_not_generate_split = 'Não pode gerar parcelas pois uma delas foi paga!',
  Finance_not_delete_split = 'Não pode deletar pois tem parcelas pagas!',
  Finance_not_delete_buy_bound = 'Não pode deletar pois tem vinculo com o compras!',
  Finance_emission_id_not_found = 'Emissão não encontrada!',
  Finance_bank_not_negative = 'Banco não permite ter saldo negativo!',
  Finance_bank_id_not_found = 'Banco não encontrado!',
  Finance_emission_is_paid = 'Não é possível alterar emissão pois ela foi paga!',
  Finance_paymentId_not_found = 'Parcela não encontrada!',
  Finance_payment_not_edit = 'Parcela não pode ser editada, pois ela foi paga!',
  Finance_payment_not_launch = 'Nenhuma parcela lançada!',
  Finance_not_finisher_split_difference_total = 'Não pode finalizar, total parcelas diferente do total da nota!',
  Finance_taxationId_not_found = 'Tributo não encontrado!',
  Finance_registerId_not_found = 'Registro tributo não encontrado!',
  Finance_not_open = 'Finance não esta aberto!',
  Finance_total_not_equal = 'Total das parcelas não conforme com total da nota!',

  //finance - bank - transfer
  Finance_BankTransfer_origin_not_found = 'Banco Origin não encontrado!',
  Finance_BankTransfer_destiny_not_found = 'Banco Destino não encontrado!',
  Finance_BankTransfer_id_not_found = 'Transferência não encontrada!',
  Finance_BankTransfer_not_delete_bound_finance = 'Erro ao deletar, existe financeiro vinculado!',
  Finance_BankTransfer_amount_not_found = 'Valor não encontrado!',
  Finance_BankTransfer_date_not_found = 'Data não encontrada!',
  Finance_BankTransfer_status_not_found = 'Status não encontrado!',

  //Fuelling
  Fuelling_id_not_found = 'Abastecimento não encontrado!',
  Fuelling_not_delete_last = 'Erro ao deletar, o existe outro abastecimento lançado!',
  Fuelling_fuel_not_found = 'Combustivel não encontrado!',
  Fuelling_product_duplicate = 'Combustivel já cadastrado!',
  Fuelling_product_not_edit = 'Erro ao editar, Combustivel vinculado!',
  Fuelling_product_not_delete = 'Erro ao deletar, Combustivel vinculado!',
  Fuelling_fuelStation_not_found = 'Posto não encontrado!',
  Fuelling_user_not_found_driver = 'Motorista não encontrado!',
  Fuelling_user_not_found_supplier = 'Abastecedor não encontrado!',
  Fuelling_user_not_driver = 'Usuario não é motorista!',
  Fuelling_user_duplicate = 'Usuario já vinculado!',
  Fuelling_control_user_not_found = 'Controle de Usuario não encontrado!',
  Fuelling_control_not_found = 'Controle não encontrado!',
  Fuelling_user_cannot_be_updated = 'Erro ao editar, Usuario lançou um abastecimento!',
  Fuelling_user_cannot_be_deleted = 'Erro ao excluir, Usuario lançou um abastecimento!',
  Fuelling_user_not_supplier = 'Usuario não é abastecedor!',
  Fuelling_tank_not_found = 'Tanque não encontrado!',
  Fuelling_train_tag_duplicate = 'Tag de comboio já registrada!',
  Fuelling_train_not_found = 'Comboio não encontrado!',
  Fuelling_train_not_delete_bound = 'Erro ao deletar, comboio tem saída vinculadas!',
  Fuelling_train_not_delete_bound_user = 'Erro ao deletar, comboio vinculado a um usuario!',
  Fuelling_train_capacity_less_balance = 'Erro ao editar, capacidade inserida menor que saldo atual!',
  Fuelling_not_create_balance_less = 'Erro ao criar, quantidade inserida é maior que possui!',
  Fuelling_type_inside_train_and_tank_not_found = 'Erro ao lançar, tanque ou comboio nao informado!',
  Fuelling_type_outside_fuelStation_and_tank_not_found = 'Erro ao lançar, tanque ou posto nao informado!',
  Fuelling_compartment_not_found = 'Compartimento não encontrado!',
  Fuelling_tank_duplicate = 'Erro ao criar, tanque já registrado!',
  Fuelling_counter_last_smaller_counter = 'Erro ao prosseguir, contador atual maior que anterior!',
  Fuelling_compartment_bigger_tank = 'Erro ao criar, soma das capacidades maior que o tanque!',
  Fuelling_compartment_bigger_train = 'Erro ao criar, soma das capacidades maior que o comboio!',
  Fuelling_compartment_not_change_capacity = 'Erro ao editar, capacidade registrada menor que o saldo atual!',
  Fuelling_tank_not_delete_is_bound = 'Erro ao deletar, vinculado a um abastecimento ou entrada!',
  Fuelling_not_tank_or_train_input = 'Erro ao criar, tanque ou comboio não enviado!',
  Fuelling_duplicate_fiscal_number_input = 'Erro ao lançar, numero fiscal já registrado!',
  Fuelling_input_not_capacity_compartment_create = 'Erro ao criar, quantidade inserida ultrapassa a capacidade!',
  Fuelling_input_not_capacity_compartment_update = 'Erro ao editar, quantidade editada ultrapassa a capacidade!',
  Fuelling_input_product_used_deleted = 'Erro ao deletar, compartimento já usado em um abastecimento!',
  Fuelling_input_product_used_updated = 'Erro ao editar, compartimento já usado em um abastecimento!',
  Fuelling_input_not_found = 'Entrada de combustivel não encontrada!',
  Fuelling_input_has_product = 'Erro ao deletar, existe item na entrada!',
  Fuelling_input_product_not_found = 'Produto da entrada não encontrada!',

  //Requester
  Requester_id_not_found = 'Solicitante não encontrado!',

  //Provider
  Provider_id_not_found = 'Fornecedor não encontrado!',

  //Material
  Material_id_not_found = 'Material não encontrado!',
  Material_code_not_found = 'Código do material não encontrado!',
  Material_code_and_material_found = 'Código do material já cadastrado!',
  Material_code_secondary_duplicate = 'Codigo secundário do material já cadastrado!',
  Name_material_exist = 'Nome do material já cadastrado!',
  Material_code_secondary_is_required = 'Codigo secundário é obrigatorio se o item é da classe material!',
  Material_code_secondary_last_one = 'Só existe um codigo secundario!',
  Material_not_delete_have_stock = 'Erro ao deletar, item possui estoque!',
  Material_not_delete_have_buy = 'Erro ao deletar, item possui compra!',
  Material_not_delete_have_plan = 'Erro ao deletar, item possui planejamento!',
  Material_not_delete_have_order_service = 'Erro ao deletar, item possui ordem de servico!',
  Material_not_delete_have_suppliers = 'Erro ao deletar, item tem vinculo!',

  // Material Codigo Secundario

  //Material Estoque
  Material_stock_id_not_found = 'Estoque do material não encontrado!',

  //Material Estoque Retirada
  Material_stock_withdrawal_id_not_found = 'Retirada do material não encontrado!',

  //Filepath
  Filepath_not_found = 'FILE_PATH não encontrado',
  URL_IMAGE_not_found = 'URL_IMAGE não encontrado!',

  //Excel
  Equipment_not_found = 'Equipamento não encontrado!',
  Equipment_Duplicate = 'Equipamento já lançado!',
  DescriptionCostCenterId_not_found = 'Descrição centro de custo não encontrado!',
  Excel_company_not_found = 'Empresa da importação não encontrada!',
  Excel_contract_branch_not_found = 'Filial do contrato não encontrada!',
  Excel_contract_provider_not_found = 'Fornecedor do contrato não encontrada!',
  Excel_contract_typeContract_not_found = 'Tipo do contrato não encontrada!',
  Excel_contract_item_typeInput_not_found = 'Tipo insumo do contrato não encontrada!',

  //Equipment
  Equipment_component_id_not_found = 'Componente não encontrado!',
  Equipment_not_delete_bound = 'Erro ao deletar equipamento vinculado!',
  Equipment_equipment_type_not_found = 'Tipo de equipamento não encontrado!',

  //Employee
  Employee_id_not_found = 'Colaborador não encontrado!',

  //Request Service Order
  Request_service_order_id_not_found = 'Pedido de Ordem de Serviço não encontrado!',
  Request_service_order_not_delete_bound = 'Erro ao deletar, pedido de ordem de serviço vinculado!',
  Request_service_order_status_not_found = 'Status do pedido de ordem de serviço não encontrado!',

  //Service Order Material
  Service_order_material_quantity_larger_stock = 'Quantidade informada maior que possui no estoque',
  Servicer_order_material_not_found_for_price = 'Valor em estoque não encontrado!',
  Service_order_material_bound_buy = 'Item já vinculado a uma compra!',
  //Service Order
  Service_order_id_not_found = 'Ordem de serviço não encontrado!',
  hourMeter_or_odometer_not_found = 'Odômetro ou Horímetro precisa ser definido!',
  Cannot_end_service_order_without_end_date = 'Não é possível encerrar a ordem de serviço sem data de término!',
  Service_order_justification_is_required = 'Justificativa é obrigatória!',
  Service_order_cannot_be_updated_until_all_materials_and_notes_are_completed = 'Todos os materiais e Paradas precisam ser concluídos!',

  //Status Service Order
  Status_order_service_not_found = 'Status de Ordem de servico não encontrado!',

  //Priority Service Order
  Priority_service_order_not_found = 'Prioridade de Ordem de servico nao encontrada!',

  //Classification Service Order
  Classification_service_order_not_found = 'Classificação de Ordem de servico não encontrada!',

  // Justify Service Order
  Justify_status_id_not_found = 'Justificativa do Status não encontrada!',

  //Note Stop
  Note_start_hour_less_than_end_hour = 'Data de inicio não pode ser inferior à data de termino!',
  Note_start_or_end_up_current_hour = 'Data de início ou término não pode ser maior à data atual!',

  // Task Service Order
  Task_service_order_id_not_found = 'Tarefa Ordem de Servico não encontrado!',
  Task_service_order_response_not_found = 'Resposta da Tarefa não encontrada!',
  //Task_service_order_plan_not_found = 'Plano não encontrado!',

  // Register Hour Task Service
  Register_hour_id_not_found = 'Registro de Hora da Tarefa não encontrado!',

  //Plan
  Plan_id_not_found = 'Plano não encontrado!',

  Company_not_found = 'Empresa não encontrada!',
  Branch_not_found = 'Filial não encontrada!',
  Provider_not_found = 'Fornecedor não encontrada!',
  Update_fail = 'Erro ao atualizar!',
  Create_fail = 'Erro ao criar!',
  Delete_fail = 'Erro ao deletar!',

  // Note
  Note_id_not_found = 'Apontamento não encontrado!',
  Note_year_limit_low_service_year = 'Ano da O.S é inferior ao limite permitido!',
  Note_conflict_hour = 'Hora de início ou término de um apontamento não pode ser maior que o horário atual',

  //Failure Analysis
  Failure_analysis_id_not_found = 'Falha de Analise não encontrado!',

  // Attachments
  Attachments_file_required = 'Arquivo é necessário!',

  // Maintenance Stock
  Maintenance_stock_id_not_found = 'Estoque de manutenção não encontrado!',

  // Maintenance Stock Out
  Maintenance_stock_out_id_not_found = 'Saída de estoque de manutenção não encontrada!',

  // Maintenance
  Maintenance_sector_executing_not_found = 'Setor executante não encontrado!',
  Maintenance_type_maintenance_not_found = 'Tipo de manutenção não encontrado!',
  Maintenance_periodicity_not_found = 'Periodicidade não encontrada!',

  // Description Planning
  Description_planning_id_not_found = 'Plano de descrição não encontrado!',

  // Task Planning Maintenance
  task_planning_maintenance_id_not_found = 'Plano de tarefa não encontrado!',
}
