class queryProducts{
    products = []
    query = {}

    constructor(products, query){
        this.products = products
        this.query = query
    }

    categoryQuery = () => {
        this.products = this.query.category ? this.products.filter(c=>c.category==this.query.category) : this.products

        /* console.log("After Category Filter:", this.products.length) */
        return this
    }

    ratingQuery = () => {
        this.products = this.query.rating ? this.products.filter(c=> parseInt(this.query.rating) <= c.rating  && c.rating < parseInt(this.query.rating)+1) : this.products
        /* console.log("After Rating Filter:", this.products.length) */
        return this
    }

    searchQuery = () => {
        this.products = this.query.searchValue ? this.products.filter(p=>p.name.toUpperCase().includes(this.query.searchValue.toUpperCase())) : this.products

        console.log("After Search Filter:", this.products.length)
        return this
    }

    priceQuery = () => {
        this.products = this.products.filter(p=>p.price>= this.query.lowPrice && p.price<= this.query.highPrice)
        /* console.log("After Price Filter:", this.products.length) */
        return this
    }

    sortByPrice = () => {
        if(this.query.sortPrice){
            if(this.query.sortPrice === 'low-to-high'){
                this.products = this.products.sort((a,b)=>a.price-b.price)
            }else{
                this.products = this.products.sort((a,b)=>b.price-a.price)
            }
        }
        return this
    }

    skip = () => {
        let {pageNumber, perPage} = this.query
        const skipPage = (parseInt(pageNumber-1)) * parseInt(perPage)
        let skippedProducts = []

        for(let i = skipPage; i< this.products.length; i++){
            skippedProducts.push(this.products[i])
        }
        this.products = skippedProducts
        return this
    }

    limit = () => {
        let temp = []
        if(this.products.length > this.query.perPage){
            for(let i = 0; i < this.query.perPage; i++){
                temp.push(this.products[i])
            }
        }else{
            temp = this.products
        }
        this.products = temp
        return this
    }

    getProducts = () => {
/*         console.log("Returning Products:", this.products.length) */
        return this.products
    }

    countProducts = () => {
        /* console.log("Total Products Count:", this.products.length) */
        return this.products.length
    }

}

module.exports = queryProducts