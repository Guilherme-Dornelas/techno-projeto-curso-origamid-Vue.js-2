const vm = new Vue({
    el: "#app",
    data:{

        produtos:[],
        produto: false,
        carrinho:[],
        carrinhoAtivo: true
    },
    methods:{
        fetchProdutos(){
            fetch("./api/produtos.json")
            .then(response => response.json())
            .then(r => {
                this.produtos = r
            })
        },
        fetchProduto(id){
                fetch(`./api/produtos/${id}/dados.json`)
                .then(response => response.json())
                .then( r => {
                    this.produto = r
                })
        },
        fecharModal({target, currentTarget}){
            if(target === currentTarget){
                this.produto = false
            }
        },
        foraCarrinho({target, currentTarget}){
            if(target === currentTarget){
                this.carrinhoAtivo = false
            }
        },
        abrirModal(id){
            this.fetchProduto(id)

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        adicionarItem(){
         this.produto.estoque --;
         const {nome, id, preco} = this.produto;
         this.carrinho.push({nome, id, preco})
        },
        removerItem(index){
            this.carrinho.splice(index, 1)
        },
        checarLocal(){
            if(window.localStorage.carrinho){
                this.carrinho = JSON.parse(window.localStorage.carrinho)
            }
        },
        // compararEstoque(){
        //     const items = this.carrinho.filter(item =>{
        //         if(item.id === this.produto.id){
        //             return true;
        //         }
        //     })
        //     this.produto = this.produto - items.length;
        // },
        router(){
            const hash = document.location.hash;
            if(hash.replace("#", "")){
                this.fetchProduto()
            }
        }
    },

    watch:{
        produto(){
            document.title = this.produto.nome || "Techno"
            const rash = this.produto.id || ""
            history.pushState(null, null, `#${rash}`)
            //  if(this.produto){
            //     this.compararEstoque()
            //  }
        },

        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },

    created(){
        this.fetchProdutos()
        this.checarLocal()
        this.router()
    },
    filters:{
        numeroPreco(valor){
            return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
        }
    },
        computed:{
            carrinhoTotal(){
                let Total = 0
                if(this.carrinho.length){
                    this.carrinho.forEach(element => {
                        Total += element.preco
                    });
                }
                return Total
            }
        }
})