const stringToHTML = (str) => {
    const parser = new DOMParser();
    return parser.parseFromString(str, 'text/html').body.firstChild
}

const renderMealItem = (i) => {
    const docHtml = stringToHTML(`<li meal-id="${i._id}">${i.nombre}</li>`);
    docHtml.addEventListener('click', () => {
        const mealsListListener = document.getElementById('meals-list')
        const mealsIdSelected = document.getElementById('meals-id')
        Array.from(mealsListListener.children).forEach(x => x.classList.remove('selected'))
        docHtml.classList.add('selected')
        mealsIdSelected.value = i._id;
    })
    return docHtml;
}

const renderOrderItem = (order, meal) => {
    const BusquedadIdMeal = meal.find(meal => meal._id === order.meal_id)
    const docHtml = stringToHTML(`<li order-id="${order._id}">${BusquedadIdMeal.nombre} - ${order.user_id}</li>`)
    return docHtml
}

let keepDatoMeal = []

const mealsLoad = () => {
    fetch('https://fireplace.alexrld.vercel.app/api/meals')
        .then(resFetch => resFetch.json())
        .then(datoMeals => {
            keepDatoMeal = datoMeals;
            const mealsList = document.getElementById('meals-list');
            const btn = document.getElementById('btn');
            mealsList.removeChild(mealsList.firstElementChild)
            const itemsMealList = datoMeals.map(renderMealItem);
            itemsMealList.forEach(element => {
                mealsList.appendChild(element)
            });
            btn.removeAttribute('disabled')
            fetch('https://fireplace.alexrld.vercel.app/api/orders')
                .then(x => x.json())
                .then(datoOrders => {
                    const ordersList = document.getElementById('orders-list')
                    ordersList.removeChild(ordersList.firstElementChild)
                    const itemsOrderList = datoOrders.map(datoOrders => renderOrderItem(datoOrders, datoMeals));
                    itemsOrderList.forEach(element => ordersList.appendChild(element))
                })
        })
}

let orderUser = 'user'

const orderLoad = () => {
    const orderForm = document.getElementById('order-form')
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const btn = document.getElementById('btn')
        btn.setAttribute('disabled', true)
        const mealId = document.getElementById('meals-id')
        const mealIdValue = mealId.value
        if (!mealIdValue) {
            alert('Por favor selecione un plato.')
            return
        }
        const order = {
            meal_id: mealIdValue,
            user_id: orderUser,
        }
        fetch('https://fireplace.alexrld.vercel.app/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order)
        })
            .then(x => x.json())
            .then(res => {
                const Ordered = renderOrderItem(res, keepDatoMeal)
                const ordersList = document.getElementById('orders-list')
                ordersList.appendChild(Ordered)
                btn.removeAttribute('disabled')
            })
    }
}

const register = () => {
    const newUser = {
        nombre: 'Carla',
        apellido: 'Denniz',
        email: 'carla@net.com',
        password: '123456',
    }
    fetch('https://fireplace.alexrld.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
}

const login = () => {
    const formLogin = document.getElementById('form-login');
    formLogin.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        fetch('https://fireplace.alexrld.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(dato => dato.json())
            .then(getToken => {
                console.log(getToken)
                localStorage.setItem('token', getToken.token)
            })
            .then(() => renderApp())
            .then(() => {
                const userToken = localStorage.getItem('token')
                fetch('https://fireplace.alexrld.vercel.app/api/auth/me', {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        authorization: userToken,
                    }
                })
                .then(x => x.json())
                .then(y => {
                    orderUser = y.nombre
                })
            })
    }
}

const renderApp = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const menuView = document.getElementById('menu-view')
        document.getElementsByTagName('body')[0].innerHTML = menuView.innerHTML;
        mealsLoad();
        orderLoad();
    }
}

window.onload = () => {
    login();
    //renderApp();
    //register();
    //mealsLoad();
    //orderLoad();
}

/* fetch('https://fireplace-three.vercel.app/api/meals')
    .then(x => x.json())
    .then(y => console.log(y))

fetch('https://fireplace.alexrld.vercel.app/api/orders')
    .then(x => x.json())
    .then(y => console.log(y)) */


//http://localhost:3000/api/meals