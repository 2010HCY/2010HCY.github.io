// 初始化 LeanCloud SDK
AV.init({
    appId: 'Fz4cbRyZ9i4Kb84tIF5t3K2e-MdYXbMMI',
    appKey: 'E3j0z0SRnw2EVYlafLDaUqxt'
});

// 全局变量
var flag = 0; // 标记状态
var url = encodeURIComponent(window.location.href); // 统一对 URL 进行编码

// 处理点赞事件
function goodplus(url, flag) {
    flag = 1; // 访客点击标记
    senddata(url, flag); // 发送数据
}

// 发送数据到 LeanCloud
function senddata(url, flag) {
    var Zan = AV.Object.extend('Zan'); // 定义数据表
    var query = new AV.Query('Zan'); // 创建查询对象
    query.equalTo("url", url); // 查询匹配的 URL

    query.find().then(function (results) {
        if (flag === 0) {
            // 页面加载时显示数据
            if (results.length === 0) {
                console.log("新增记录");
                var zan = new Zan();
                zan.set('url', url);
                zan.set('views', 0);
                zan.save().then(function () {
                    document.getElementById("zan_text").innerHTML = "0";
                });
            } else {
                console.log("显示已有数据");
                var vViews = results[0].get('views');
                document.getElementById("zan_text").innerHTML = vViews;
            }
        } else if (flag === 1) {
            // 用户点击时更新数据
            if (results.length === 1) {
                console.log("更新记录");
                var zan = results[0];
                var vViews = zan.get('views');
                zan.set('views', vViews + 1);
                zan.save().then(function () {
                    document.getElementById("zan_text").innerHTML = vViews + 1;
                });
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

// 页面加载时初始化点赞按钮
$(document).ready(function () {
    // 添加点赞按钮到文章内容
    $(".post-content").append(
        `<div id='zan' class='clearfix'>
            <div class='heart' onclick="goodplus('${url}')"></div>
            <br>
            <div id='zan_text'></div>
        </div>`
    );

    // 加载时获取点赞数
    senddata(url, flag);

    // 点击动画效果
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
