// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyD-5T6GVI0iLdg", 
    authDomain: "afiliados-e32b5.firebaseapp.com",
    databaseURL: "https://afiliados-e32b5-default-rtdb.firebaseio.com",
    projectId: "afiliados-e32b5",
    storageBucket: "afiliados-e32b5.appspot.com",
    messagingSenderId: "527757792488",
    appId: "1:527757792488:web:0928f5c3faaef9fa6d255d"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function esconderLoader() {
    const loader = document.getElementById('loader');
    if(loader) {
        loader.style.transition = "opacity 0.4s ease";
        loader.style.opacity = "0";
        setTimeout(() => { loader.style.display = 'none'; }, 400);
    }
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoID = urlParams.get('id') || 'default';

    database.ref('produtos/' + produtoID).once('value')
    .then((snapshot) => {
        const dados = snapshot.val();
        
        if (dados) {
            // 1. Atualiza o Título da Aba do Navegador
            document.title = (dados.titulo || "Product") + " - Official Store";

            // 2. Atualiza o Título Visível na Página
            if(document.getElementById('titulo-produto')) {
                document.getElementById('titulo-produto').innerText = dados.titulo;
            }

            // 3. Atualiza Meta Description (SEO)
            const metaDesc = document.getElementById('meta-description');
            if(metaDesc) {
                metaDesc.content = "Get the " + dados.titulo + " at the best price. Limited time offer!";
            }

            // 4. Atualiza Restante do Conteúdo
            if(document.querySelector('.description')) document.querySelector('.description').innerText = dados.descricao;
            if(document.getElementById('foto-produto')) document.getElementById('foto-produto').src = dados.foto;
            if(document.getElementById('preco-exibicao')) document.getElementById('preco-exibicao').innerText = "$" + dados.preco;
            
            // 5. Configuração do Botão
            const botao = document.getElementById('btn-vendas');
            if (botao) {
                botao.onclick = () => {
                    if (dados.link) window.location.href = dados.link;
                };
            }
        }
        esconderLoader();
    })
    .catch((error) => {
        console.error("Error loading data:", error);
        esconderLoader();
    });

    if (urlParams.get('admin') === 'true') {
        const painel = document.getElementById('painel-admin');
        if(painel) painel.style.display = 'block';
    }
};

function salvarConfiguracoes() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoID = urlParams.get('id') || 'default';

    const dadosParaSalvar = {
        titulo: document.getElementById('input-titulo').value.trim(),
        descricao: document.getElementById('input-descricao').value.trim(),
        link: document.getElementById('input-link').value.trim(),
        foto: document.getElementById('input-foto').value.trim(),
        preco: document.getElementById('input-preco').value.trim()
    };

    database.ref('produtos/' + produtoID).set(dadosParaSalvar)
    .then(() => {
        alert("Success! Settings saved.");
        location.reload(); // Recarrega para aplicar as mudanças
    })
    .catch((error) => {
        alert("Error saving: " + error.message);
    });
}