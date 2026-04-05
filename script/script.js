
const produtos = [
    {
        id: 1,
        nome: "Brinco Pérola",
        preco: 79.90,
        imagem: "imagens/brinco-perola.png",
        descricao: "Colar banhado a ouro 18k com pingente de coração"
    },
    {
        id: 2,
        nome: "Brinco Flor Pérola",
        preco: 79.90,
        imagem: "imagens/brinco-folha-perola.jpeg",
        descricao: "Argolas banhadas a ouro com design moderno"
    },
    {
        id: 3,
        nome: "Brinco Pétalas",
        preco: 59.90,
        imagem: "imagens/brinco-petala-flor.jpeg",
        descricao: "Pulseira malha lisa banhada a ouro 18k"
    },
    {
        id: 4,
        nome: "Brinco Argola",
        preco: 59.90,
        imagem: "imagens/brinco-argola.png",
        descricao: "Anel com zircônia central banhado a ouro"
    },
    {
        id: 5,
        nome: "Brinco Ear Cuff",
        preco: 69.90,
        imagem: "imagens/brinco-earcuff-dourado.jpeg",
        descricao: "Conjunto completo banhado a ouro 18k"
    },
    {
        id: 6,
        nome: "Brinco Gota",
        preco: 79.90,
        imagem: "imagens/brinco-gota-zirconia.jpeg",
        descricao: "Corrente grossa banhada a ouro para looks poderosos"
    }
];


let carrinho = [];


const produtosGrid = document.getElementById('produtosGrid');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartIcon = document.querySelector('.cart-icon');
const closeModal = document.querySelector('.close');


document.addEventListener('DOMContentLoaded', function() {
    renderizarProdutos();
    atualizarContadorCarrinho();
    
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

   
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
});


function renderizarProdutos() {
    produtosGrid.innerHTML = '';
    
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <div class="produto-image">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                <button class="produto-add" onclick="adicionarAoCarrinho(${produto.id})">
                    <i class="fas fa-shopping-cart"></i> Adicionar
                </button>
            </div>
        `;
        produtosGrid.appendChild(card);
    });
}


function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    
    
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    atualizarContadorCarrinho();
    mostrarNotificacao('Produto adicionado ao carrinho!');
    
 
    const botao = event.target.closest('.produto-add');
    botao.style.transform = 'scale(0.95)';
    setTimeout(() => {
        botao.style.transform = 'scale(1)';
    }, 150);
}


function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
}


function renderizarCarrinho() {
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Seu carrinho está vazio</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center;">
                <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px;">
                <div>
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2).replace('.', ',')} x ${item.quantidade}</p>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button onclick="alterarQuantidade(${item.id}, -1)" style="background: #ddd; border: none; padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer;">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade(${item.id}, 1)" style="background: #ddd; border: none; padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer;">+</button>
                <button onclick="removerDoCarrinho(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}


function alterarQuantidade(produtoId, cambio) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade += cambio;
        if (item.quantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            atualizarContadorCarrinho();
            renderizarCarrinho();
        }
    }
}


function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarContadorCarrinho();
    renderizarCarrinho();
    mostrarNotificacao('Produto removido do carrinho!');
}


cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderizarCarrinho();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});


function mostrarNotificacao(mensagem) {
    
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);
    
    
    notificacao.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #11114E;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(17, 17, 78, 0.4);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    
    setTimeout(() => {
        notificacao.style.transform = 'translateX(0)';
    }, 100);
    
    
    setTimeout(() => {
        notificacao.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}


window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});