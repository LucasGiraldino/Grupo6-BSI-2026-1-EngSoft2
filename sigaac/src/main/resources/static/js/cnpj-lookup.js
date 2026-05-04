/**
 * SIGAAC - CNPJ Lookup
 * Consulta CNPJ via BrasilAPI e preenche automaticamente os campos do formulário
 */
document.addEventListener('DOMContentLoaded', () => {
    const cnpjInput = document.querySelector('input[name="cnpj"]');
    if (!cnpjInput) return;

    const razaoInput = document.querySelector('input[name="razaoSocial"]');
    const fantasiaInput = document.querySelector('input[name="nomeFantasia"]');
    const telInput = document.querySelector('input[name="telefone"]');
    const emailInput = document.querySelector('input[name="email"]');
    const cepInput = document.querySelector('input[name="endereco.cep"]');
    const ruaInput = document.querySelector('input[name="endereco.rua"]');
    const numeroInput = document.querySelector('input[name="endereco.numero"]');
    const bairroInput = document.querySelector('input[name="endereco.bairro"]');
    const cidadeInput = document.querySelector('input[name="endereco.cidade"]');
    const estadoSelect = document.querySelector('select[name="endereco.estado"]');

    let cnpjTimeout;

    cnpjInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 14);
        clearTimeout(cnpjTimeout);
    });

    cnpjInput.addEventListener('blur', function () {
        const cnpj = this.value.replace(/\D/g, '');
        if (cnpj.length !== 14) return;

        fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
            .then(resp => resp.json())
            .then(data => {
                if (data.message) {
                    console.warn('CNPJ não encontrado:', data.message);
                    return;
                }

                if (data.razao_social && razaoInput) razaoInput.value = data.razao_social;
                if (data.nome_fantasia && fantasiaInput) fantasiaInput.value = data.nome_fantasia;
                if (data.telefone && telInput) telInput.value = data.telefone;
                if (data.email && emailInput) emailInput.value = data.email;
                if (data.cep && cepInput) cepInput.value = data.cep.replace(/\D/g, '').slice(0, 8);
                if (data.logradouro && ruaInput) ruaInput.value = data.logradouro;
                if (data.numero && numeroInput) numeroInput.value = data.numero;
                if (data.bairro && bairroInput) bairroInput.value = data.bairro;
                if (data.municipio && cidadeInput) cidadeInput.value = data.municipio;
                if (data.uf && estadoSelect) estadoSelect.value = data.uf;
            })
            .catch(err => console.error('Erro ao consultar CNPJ:', err));
    });
});
