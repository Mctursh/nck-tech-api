//a class model for the cart
class Cart {
    constructor(prevCart, currDbItemData) {
        this.items = prevCart.items || {}
        this.currDbItemData = currDbItemData[0]
        this.totalQuantity = prevCart.totalQuantity || 0
        this.totalPrice = prevCart.totalPrice || 0
    }

    addItem(item, itemId) {
        if (this.currDbItemData.quantity > 0) { //checks if the item still available in stock
            let existingItem = this.items[itemId]
            if (!existingItem) { //checks if the item already exist in cart
                const {name, price: unitPrice, id} = item
                existingItem = this.items[itemId] = { item: {name, unitPrice, id}, quantity: 0, sumPrice: 0 }
            }
            existingItem.quantity++ 
            existingItem.sumPrice = existingItem.item.unitPrice * existingItem.quantity
            this.totalQuantity++
            this.totalPrice += existingItem.item.unitPrice
            this.currDbItemData.quantity--
            return [true, "Successfully added item to cart"]            
        } else {
            return [false, "Failed to add item to cart, Item out of stock"]    
        } 
    }

    getNewData() {
        return [{items: this.items, totalQuantity: this.totalQuantity, totalPrice: this.totalPrice}, this.currDbItemData]
    }
}


module.exports = Cart