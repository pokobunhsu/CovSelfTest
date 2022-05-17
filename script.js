const version = "Ver.2022/05/17"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const country = urlParams.get('country')
let list = document.querySelector('.bottom')
let inputText = document.querySelector('#country')
let notice = document.querySelector('.notice')
let lastUpdate = document.querySelector('#lastUpdate')
let show = document.querySelector('.show')
let momIcon = document.querySelector('.momDayIcon')
let sayList = document.querySelector('.sayList')
let sayListAll = document.querySelector('#sayListAll')
let scrollEnable = true
let index = 0
let dayArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
let whocanbuy = ""
let day = new Date()
if (day.getDay() == 0) {
    whocanbuy = "不限"
} else {
    if (day.getDay() % 2 != 0) {
        whocanbuy = "單數"
    } else {
        whocanbuy = "雙數"
    }
}

window.onload = () => {
    if (inputText.value != "") {
        if (inputText.value == "母親節快樂") {
            show.textContent = "想跟媽媽說什麼?☺"
            setInterval(momChat, 1000)
        } else {
            scrollEnable = false
            fetch(`https://pokoapi.herokuapp.com/selfTest/${country}/${index}`).then(c => {
                return c.json()
            }).then(res => {
                scrollEnable = true
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
                            <a href="https://www.google.com/maps/search/?api=1&query=${element.醫事機構地址}?openExternalBrowser=1" target="blank"><img
                            src="https://img.icons8.com/ios/50/000000/address--v1.png" width="40px" /></a>
                        </div>
                        <h5>${element.醫事機構地址}</h5>
                    </div>
                `
                        list.innerHTML += data
                    });
                } else {
                    notice.setAttribute('style', 'display:inline;')
                    notice.innerHTML = "您搜尋的地區可能都沒有貨了<br>請重新輸入地區<br>開始查詢!<br><br>😍🥰😎"
                }
            }).catch((err) => {
                notice.setAttribute('style', 'display:inline;')
                notice.innerHTML = "伺服器壞壞了!請等我恢復再過來OAO<br><br>😑😑😑"
            })
        }

    } else {
        notice.setAttribute('style', 'display:inline;')
        notice.innerHTML = `請輸入地區開始查詢吧!<br><br>😎🤣😁<br><br>ex:林口 or 竹北 or 南投<br><br> <span class="whocanbuy">今天是${dayArr[day.getDay()]}<br>身分證尾數<span style="color:red;">${whocanbuy}</span><br>可以購買喔!</span>`
    }
}


inputText.value = country

document.title = document.title + " " + version


fetch(`https://pokoapi.herokuapp.com/selfTest/lastUpdate`).then(c => {
    return c.text()
}).then(res => {
    lastUpdate.textContent = res
})







let search = () => {
    console.log(inputText.value.indexOf("台"));
    if (inputText.value.indexOf("台") != -1) {
        inputText.value = inputText.value.replace('台', '臺')
    }
    location.href = `./index.html?country=${inputText.value}`
}


let getAfter = () => {
    show.textContent = "正在載入更多😎..."
    fetch(`https://pokoapi.herokuapp.com/selfTest/lastUpdate`).then(c => {
        return c.text()
    }).then(res => {
        lastUpdate.textContent = res
    })
    fetch(`https://pokoapi.herokuapp.com/selfTest/${country}/${index}`).then(c => {
        return c.json()
    }).then(res => {
        console.log(res.length);
        scrollEnable = true
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
                <h5>${element.醫事機構地址}</h5>
            </div>
        `
                show.textContent = "請繼續往下滑😉..."
                list.innerHTML += data
            });
        } else {
            show.textContent = "已經到最底了😫"
            setTimeout(() => {
                show.textContent = "快篩試劑還有嗎?"
            }, 5000)
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
    show.textContent = "快篩試劑還有嗎?"
    if (st >= (sh - ch) - 1 && scrollEnable == true) {
        console.log("已到最底");
        index += 12
        scrollEnable = false
        getAfter()
    }
}

let scrollCheckMom = (e) => {
    sh = e.target.scrollHeight
    ch = e.target.clientHeight
    st = e.target.scrollTop
    console.log("滑動中....", sh, ch, st);
    if (st >= (sh - ch) - 1 && scrollEnable == true) {
        console.log("已到最底");
        scrollEnable = false
    }
}


let momChat = () => {
    fetch(`https://pokoapi.herokuapp.com/sayToMom`).then(c => {
        return c.json()
    }).then(res => {
        console.log(res);
        sayListAll.innerHTML = ""
        res.forEach((el) => {
            console.log(el);
            sayListAll.innerHTML +=
                `
                <li>${el.postSay}<span
                            class="poster">by ${el.postName}</span>
                `
        })
    })
}


let say = () => {
    let sayName = document.querySelector("#sayName")
    let sayText = document.querySelector("#sayText")
    fetch(`https://pokoapi.herokuapp.com/sayToMom/post/${sayName.value}/${sayText.value}`).then(c => {
        return c.json()
    })
    sayText.value = ""
}

inputText.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        search()
    }
})
// momIcon.addEventListener('click', (e) => {
//     location.href = `./index.html?country=母親節快樂`
// })


if (inputText.value == "母親節快樂") {
    sayList.setAttribute("style", "display:inline;")
} else {
    list.addEventListener('scroll', scrollCheck)
}