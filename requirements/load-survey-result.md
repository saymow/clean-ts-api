# Carregar resultado de enquete

> ## Caso de sucesso
> - ❌ Recebe uma requisição do tipo **GET** na rota **/api/surveys/{survey_id}/results** 
> - ❌ Valida se a requisição foi feita por um usuário
> - ❌ Retorna **204** se não tiver nenhum resultado de enquete 
> - ❌ Retorna **200** com os dados resultado de enquete 

> ## Exceções
> - ❌ Retorna erro **403** se não for um usuário
> - ❌ Retorna erro **404** se a API não existir
> - ❌ Retorna erro **500** se der erro ao tentar listar o resultado da enquente