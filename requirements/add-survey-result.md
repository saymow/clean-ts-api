# Responder Enquete

> ## Caso de sucesso
> - ❌ Recebe uma requisição do tipo **PUT** na rota **/api/surveys/{survey_id}/results** 
> - ❌ Valida se a requisição foi feita por um **usuário**
> - ❌ Valida o parâmetro **survey-id**
> - ❌ Valida se o campo **answer** é uma resposta válida
> - ❌ **Cria** um resultado de enquete com os dados fornecidos, caso não tenha um registro
> - ❌ **Atualiza** um resultado de enquete com os dados fornecidos, caso não tenha um registro
> - ❌ Retorna  **200** com os dados da enquete

> ## Exceções
> - ❌ Retorna erro **404** se a API não existir
> - ❌ Retorna erro **401** se  token de autenticação não for fornecido
> - ❌ Retorna erro **403** se o usuário survey_id passado na URL for inválido
> - ❌ Retorna erro **400** se o campo **answer** não for fornecidas pelo client
> - ❌ Retorna erro **500** se der erro ao tentar criar resultado de enquente
> - ❌ Retorna erro **500** se der erro ao tentar atualizar resultado de enquente