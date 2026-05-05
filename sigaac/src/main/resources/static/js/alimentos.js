let idParaExcluir = null;

async function carregarCategorias() {
    const res = await fetch('/alimentos/categorias');
    const categorias = await res.json();
    const select = document.getElementById('campo-categoria');
    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    categorias.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nome;
        select.appendChild(opt);
    });
}

async function carregarAlimentos() {
    const tbody = document.getElementById('tabela-alimentos');
    try {
        const res = await fetch('/alimentos');
        const alimentos = await res.json();
        if (alimentos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-12 text-center text-gray-400">Nenhum alimento cadastrado</td></tr>`;
            return;
        }
        tbody.innerHTML = alimentos.map(a => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">${a.nome}</td>
                <td class="px-6 py-4 text-gray-600">${a.categoria?.nome ?? '-'}</td>
                <td class="px-6 py-4 text-gray-600">${a.unidadeMedida}</td>
                <td class="px-6 py-4 text-gray-600">${a.dataVencimento ? new Date(a.dataVencimento).toLocaleDateString('pt-BR') : '-'}</td>
                 <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Ativo
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button onclick="abrirModalEdicao(${JSON.stringify(a).replace(/"/g, '&quot;')})" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900">
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                        </button>
                        <button onclick="abrirModalDelete(${a.id})" class="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch {
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-12 text-center text-red-500">Erro ao carregar alimentos</td></tr>`;
    }
    lucide.createIcons();
}

function abrirModal() {
    document.getElementById('modal-titulo').textContent = 'Novo Alimento';
    document.getElementById('form-alimento').reset();
    document.getElementById('campo-id').value = '';
    document.getElementById('campo-ativo').checked = true;
    document.getElementById('erro-form').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function abrirModalEdicao(alimento) {
    document.getElementById('modal-titulo').textContent = 'Editar Alimento';
    document.getElementById('campo-id').value = alimento.id;
    document.getElementById('campo-nome').value = alimento.nome;
    document.getElementById('campo-descricao').value = alimento.descricao ?? '';
    document.getElementById('campo-unidade').value = alimento.unidadeMedida;
    document.getElementById('campo-vencimento').value = alimento.dataVencimento ?? '';
    document.getElementById('campo-categoria').value = alimento.categoria?.id ?? '';
    document.getElementById('erro-form').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modal').classList.add('hidden');
}

async function salvar(e) {
    e.preventDefault();
    const id = document.getElementById('campo-id').value;
    const body = {
        nome: document.getElementById('campo-nome').value,
        descricao: document.getElementById('campo-descricao').value,
        unidadeMedida: document.getElementById('campo-unidade').value,
        dataVencimento: document.getElementById('campo-vencimento').value || null,
        categoria: { id: parseInt(document.getElementById('campo-categoria').value) }
    };

    const url = id ? `/alimentos/${id}` : '/alimentos';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        fecharModal();
        carregarAlimentos();
    } catch {
        const erro = document.getElementById('erro-form');
        erro.textContent = 'Erro ao salvar alimento. Verifique os dados e tente novamente.';
        erro.classList.remove('hidden');
    }
}

function abrirModalDelete(id) {
    idParaExcluir = id;
    document.getElementById('modal-delete').classList.remove('hidden');
}

function fecharModalDelete() {
    idParaExcluir = null;
    document.getElementById('modal-delete').classList.add('hidden');
}

async function confirmarDelete() {
    try {
        await fetch(`/alimentos/${idParaExcluir}`, { method: 'DELETE' });
        fecharModalDelete();
        carregarAlimentos();
    } catch {
        fecharModalDelete();
    }
}

async function abrirModalCategorias() {
    document.getElementById('modal-categorias').classList.remove('hidden');
    await renderizarListaCategorias();
    lucide.createIcons();
}

function fecharModalCategorias() {
    document.getElementById('modal-categorias').classList.add('hidden');
    document.getElementById('nova-categoria-nome').value = '';
}

async function renderizarListaCategorias() {
    const lista = document.getElementById('lista-categorias');
    const res = await fetch('/alimentos/categorias');
    const categorias = await res.json();
    if (categorias.length === 0) {
        lista.innerHTML = `<li class="text-sm text-gray-400 text-center py-2">Nenhuma categoria cadastrada</li>`;
        return;
    }
    lista.innerHTML = categorias.map(c => `
        <li class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
            <span class="text-sm text-gray-700">${c.nome}</span>
            <button onclick="excluirCategoria(${c.id})" class="p-1 hover:bg-red-50 rounded transition-colors text-gray-400 hover:text-red-600">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </li>
    `).join('');
    lucide.createIcons();
}

async function criarCategoria(e) {
    e.preventDefault();
    const nome = document.getElementById('nova-categoria-nome').value.trim();
    await fetch('/alimentos/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
    });
    document.getElementById('nova-categoria-nome').value = '';
    await carregarCategorias();
    await renderizarListaCategorias();
}

async function excluirCategoria(id) {
    await fetch(`/alimentos/categorias/${id}`, { method: 'DELETE' });
    await carregarCategorias();
    await renderizarListaCategorias();
}

carregarCategorias();
carregarAlimentos();
lucide.createIcons();
