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
    fetch('http://localhost:3000/api/meals', {
        headers:{authorization:localStorage.getItem('token')}
    })
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
            fetch('http://localhost:3000/api/orders', {
                headers:{authorization:localStorage.getItem('token')}
            })
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
        if (!localStorage.getItem('token')) location.reload();
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
        fetch('http://localhost:3000/api/orders', {
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

const me = () => {
    const userToken = localStorage.getItem('token')
    fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
        }
    })
        .then(dato => dato.json())
        .then(user => {
            orderUser = user.nombre
            localStorage.setItem('user', user.nombre)
        })
}

const login = () => {
    const formLogin = document.getElementById('form-login');
    formLogin.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) return alert('Ingrese sus datos por favor')
        fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(dato => dato.json())
            .then(getToken => localStorage.setItem('token', getToken.token))
            .then(() => {
                renderApp();
                me();
            })
            .catch(() => alert('Usuario y/o constraseña incorrectos'))
    }
    const toRegView = document.getElementById('toRegView')
    toRegView.onclick = (e) => {
        e.preventDefault();
        registerLoad()
    }
}

const menuView = document.getElementById('menu-view')

const renderApp = () => {
        document.getElementsByTagName('body')[0].innerHTML = menuView.innerHTML;
        mealsLoad();
        orderLoad();   
}

const registerLoad = () => {
    const registerView = document.getElementById('register-view')
    document.getElementsByTagName('body')[0].innerHTML = registerView.innerHTML
    const registerForm = document.getElementById('register-form')
    registerForm.onsubmit = (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value
        const apellido = document.getElementById('apellido').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        if (!nombre || !apellido || !email || !password) return alert('Debe ingresar todos los campos por favor')
        const newUser = {
            nombre,
            apellido,
            email,
            password
        }
        fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(dato => dato.json())
            .then(getToken => localStorage.setItem('token', getToken.token))
            .then(() => {
                renderApp();
                me();
            })
            .catch(() => alert('El usuario ya existe!'))
    }
}

window.onload = () => {
    login();
    if (localStorage.getItem('token')) {
        me();
        renderApp();
    };
}









//renderApp();
//register();
//mealsLoad();
//orderLoad();

/* fetch('https://fireplace-three.vercel.app/api/meals')
    .then(x => x.json())
    .then(y => console.log(y))

fetch('https://fireplace.alexrld.vercel.app/api/orders')
    .then(x => x.json())
    .then(y => console.log(y)) */


//http://localhost:3000/api/meals