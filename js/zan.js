AV.init({
    appId: 'Fz4cbRyZ9i4Kb84tIF5t3K2e-MdYXbMMI',
    appKey: 'E3j0z0SRnw2EVYlafLDaUqxt'
});
var flag = 0;
var url = encodeURIComponent(window.location.href);

// 设置是否限制访客点赞次数（true = 限制，false = 不限制）
var enableLimit = true;
// 最大点赞次数
var maxLikes = 5;

function getVisitorLikes() {
    var likes = getCookie("visitor_likes");
    return likes ? parseInt(likes) : 0; 
}

function setVisitorLikes(likes) {
    setCookie("visitor_likes", likes, 30); 
}

function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
        var cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 设置过期时间
    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function goodplus(url) {
    if (enableLimit) {
        var currentLikes = getVisitorLikes();
        if (currentLikes >= maxLikes) {
            showAlert("最多只能点 " + maxLikes + " 个赞");
            return; 
        }
    }

    senddata(url, 1);
}

// 发送数据到 LeanCloud
function senddata(url, flag) {
    var Zan = AV.Object.extend('Zan');
    var query = new AV.Query('Zan');
    query.equalTo("url", url);

    query.find().then(function (results) {
        if (results.length === 0) {
            console.log("新增记录");
            var zan = new Zan();
            zan.set('url', url);
            zan.set('views', flag === 1 ? 1 : 0);
            zan.save().then(function () {
                document.getElementById("zan_text").innerHTML = flag === 1 ? "1" : "0";
                if (enableLimit && flag === 1) {
                    var currentLikes = getVisitorLikes();
                    setVisitorLikes(currentLikes + 1); // 增加点赞次数
                }
            });
        } else {
            var zan = results[0];
            var vViews = zan.get('views');
            if (flag === 1) {
                console.log("更新记录");
                zan.set('views', vViews + 1);
                zan.save().then(function () {
                    document.getElementById("zan_text").innerHTML = vViews + 1;
                    if (enableLimit) {
                        var currentLikes = getVisitorLikes();
                        setVisitorLikes(currentLikes + 1); // 增加点赞次数
                    }
                });
            } else {
                console.log("显示已有数据");
                document.getElementById("zan_text").innerHTML = vViews;
            }
        }
    }).catch(function (error) {
        console.error("查询或保存出错：", error);
    });
}

// 动画辅助函数
function remcls() {
    $('.heart').removeClass("heartAnimation");
}

function addcls() {
    $('.heart').addClass("heartAnimation");
}

// 显示自动关闭的弹窗提示
function showAlert(message) {
    var alertBox = document.createElement("div");
    alertBox.innerText = message;
    alertBox.style.position = "fixed";
    alertBox.style.top = "20%";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translate(-50%, -50%)";
    alertBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    alertBox.style.color = "white";
    alertBox.style.padding = "15px 30px";
    alertBox.style.borderRadius = "8px";
    alertBox.style.zIndex = "1000";
    alertBox.style.fontSize = "16px";
    alertBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(alertBox);

    // 3 秒后自动关闭
    setTimeout(function () {
        document.body.removeChild(alertBox);
    }, 3000);
}

$(document).ready(function () {
    senddata(url, flag);

    $('body').on("click", '.heart', function () {
        var heartClass = $('.heart').attr("class");
        if (heartClass === 'heart') {
            $('.heart').addClass("heartAnimation");
            setTimeout(remcls, 800);
        } else {
            remcls();
            setTimeout(addcls, 100);
        }
    });
});
