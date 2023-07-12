let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");


//從localStorage取資料
let basket = JSON.parse(localStorage.getItem("data")) || [];

//購物車物品數量
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y)=>x+y, 0);   
}

calculation(); 

let generateCarItems = () => {
    if(basket.length !== 0) {  /* 購物車有東西 */
        return (ShoppingCart.innerHTML=basket.map((x)=>{
            let {id, item} = x;
            let search = shopItemsData.find((y)=> y.id === id) || []; //從Data.js找圖片位置
            let {img, name, price} = search; //destructure
            return `
            <div class="cart-item">
                <img width="100" src="${img}" alt="" />
                <div class="details"> 
                    <div class="title-price-x"> 
                        <h4 class="title-price">
                            <p>${name}</p>
                            <p class="cart-item-price">$ ${price}</p>
                        </h4>
                        <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                    </div>
                    <div class="buttons">
                        <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                        <div id=${id} class="quantity">${item}</div>
                        <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                    </div>
                    <h3>$ ${item * price} </h3>
                </div>
            </div>
            `;
        }).join(''));
    } else {  /* 購物車為空 */
        ShoppingCart.innerHTML = ``
        label.innerHTML = `
            <h2>Cart is Empty</h2>
            <a href="index.html">
                <button class="HomeBtn">Back to home</button>
            </a>
        `;
    }
}

generateCarItems();

//增減function
let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
    
    if(search === undefined) {
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    } else {
        search.item += 1;
    }    
    generateCarItems(); //增加物品時，重新渲染，讓價格更新。
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
    
    if(search === undefined) return;  //當local storage是空的時候停止process
    else if(search.item === 0) return; //數量扣到零時停止process
    else {
        search.item -= 1;
    }
    update(selectedItem.id);
    basket = basket.filter((x) => x.item !== 0); //物品數量扣至0時就移除
    generateCarItems(); //rerendor our cards, 物品消失.
    localStorage.setItem("data", JSON.stringify(basket)); 
};

let update = (id) => {
    let search = basket.find((x) => x.id === id);
    //console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    TotalAmount(); //讓Total Bill 即時更新
};

let removeItem = (id) => {
    let selectedItem = id;
    //console.log(selectedItem.id);
    basket = basket.filter((x)=> x.id !== selectedItem.id) //保留id不是selectedItem.id的元素
    generateCarItems(); //rerender the cards.
    TotalAmount(); //讓刪掉物品時Total Bill 即時更新
    calculation(); //讓刪掉物品時購物車icon 即時更新
    localStorage.setItem("data", JSON.stringify(basket)); 
};

let clearCart = () => {
    basket = [];
    generateCarItems(); //rerender the cart
    calculation(); //Clear Cart時即時更新購物車icon數量
    localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = ()=>{
    if(basket.length !==0) {
        let amount = basket.map((x)=>{
            let {item, id} = x;
            let search = shopItemsData.find((y)=> y.id === id) || []; //從Data.js找圖片位置
            return item * search.price;
        }).reduce((x,y)=>x+y,0);  //加總所有價格
        //console.log(amount);
        label.innerHTML = `
            <h2>Total Bill : $ ${amount}</h2>
            <button class="checkout">Checkout</button>
            <button onClick="clearCart()" class="removeAll">Clear Cart</button>
        `;
    }
    else return;
};

TotalAmount();