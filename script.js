const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const country = urlParams.get('country')
let list = document.querySelector('.bottom')
let inputText = document.querySelector('#country')
let notice = document.querySelector('.notice')
let lastUpdate = document.querySelector('#lastUpdate')
let index = 0
inputText.value = country


fetch(`https://pokoapi.herokuapp.com/selfTest/lastUpdate`).then(c => {
    return c.text()
}).then(res => {
    lastUpdate.textContent = res
})

if (inputText.value != "") {
    fetch(`https://pokoapi.herokuapp.com/selfTest/${country}/${index}`).then(c => {
        return c.json()
    }).then(res => {
        console.log(res);
        if (res.length != 0) {
            res.forEach(element => {
                let data = `
            <div class="card">
                <h2>${element.醫事機構名稱}</h2>
                <h3 class="remain">剩下${element.快篩試劑截至目前結餘存貨數量}份</h3>
                <h4>備註：<br>${element.備註}</h4>
                <div class="func">
                    <a href="tel:${element.醫事機構電話}"><img src="https://img.icons8.com/ios/50/000000/outgoing-call.png" width="40px" /></a>
                    <a href="https://www.google.com/maps/search/?api=1&query=${element.醫事機構地址}" target="blank"><img
                    src="https://img.icons8.com/ios/50/000000/address--v1.png" width="40px" /></a>
                </div>
            </div>
        `
                list.innerHTML += data
            });
        } else {
            notice.setAttribute('style', 'display:inline;')
            notice.innerHTML = "請重新輸入地區，開始查詢!<br><br>😍🥰😎🤣😁😝😜😇"
        }
    }).catch((err) => {
        notice.setAttribute('style', 'display:inline;')
        notice.innerHTML = "請重新輸入地區，開始查詢!<br><br>😍🥰😎🤣😁😝😜😇"
    })
} else {
    notice.setAttribute('style', 'display:inline;')
    notice.innerHTML = "請輸入地區開始查詢吧!<br><br>😍🥰😎🤣😁😝😜😇<br><br>ex:林口 or 竹北 or 南投"
}





let search = () => {
    console.log(inputText.value.indexOf("台"));
    if (inputText.value.indexOf("台") != -1) {
        inputText.value = inputText.value.replace('台', '臺')
    }
    location.href = `./index.html?country=${inputText.value}`
}


let getAfter = () => {
    fetch(`https://pokoapi.herokuapp.com/selfTest/lastUpdate`).then(c => {
        return c.text()
    }).then(res => {
        lastUpdate.textContent = res
    })
    fetch(`https://pokoapi.herokuapp.com/selfTest/${country}/${index}`).then(c => {
        return c.json()
    }).then(res => {
        console.log(res.length);
        if (res.length != 0) {
            res.forEach(element => {
                let data = `
            <div class="card">
                <h2>${element.醫事機構名稱}</h2>
                <h3 class="remain">剩下${element.快篩試劑截至目前結餘存貨數量}份</h3>
                <h4>備註：<br>${element.備註}</h4>
                <div class="func">
                    <a href="tel:${element.醫事機構電話}"><img src="https://img.icons8.com/ios/50/000000/outgoing-call.png" width="40px" /></a>
                    <a href="https://www.google.com/maps/search/?api=1&query=${element.醫事機構地址}" target="blank"><img
                    src="https://img.icons8.com/ios/50/000000/address--v1.png" width="40px" /></a>
                </div>
            </div>
        `
                list.innerHTML += data
            });
        } else {
            removeHandler()
        }
    })
}


let removeHandler = () => {
    list.removeEventListener("scroll", scrollCheck);
}

let scrollCheck = (e) => {
    sh = e.target.scrollHeight
    ch = e.target.clientHeight
    st = e.target.scrollTop
    console.log("滑動中....", sh, ch, st);
    if (st >= (sh - ch) - 1) {
        console.log("已到最底");
        index += 12
        getAfter()
    }
}

inputText.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        search()
    }
})


list.addEventListener('scroll', scrollCheck)

