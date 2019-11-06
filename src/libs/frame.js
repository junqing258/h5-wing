/**
 * requestAnimationFrame兼容处理
 */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());


function Frame(ctx) {
    this.ctx = ctx;
    this.p_x = 0;
    this.p_y = 0;
    this.cmds = [];
    this.graphicscmd = [];
}

Frame.prototype.draw = function() {

};

Frame.prototype.drawPath = function() {
    var args = Array.prototype.slice.call(arguments);
    this.graphicscmd.push(args);

    return args;
};

Frame.prototype.update = function() {

    if (this.graphicscmd.length) {
        var ctx = this.ctx;

        for (var args of this.graphicscmd) {
            var props = args[2];
            props.fillStyle && (ctx.fillStyle = props.fillStyle);
            props.lineWidth && (ctx.lineWidth = props.lineWidth);
            switch (args[0]) {
                case 'fillRect':
                    var p = args[1];
                    ctx.fillRect(this.p_x + p[0], this.p_y + p[1], p[2], p[3]);
                    break;
                case 'lineTo':
                    ctx.beginPath();
                    ctx.moveTo(this.p_x, this.p_y);
                    ctx[args[0]].apply(ctx, [args[1][0] + this.p_x, args[1][1] + this.p_y]);
                    ctx.stroke();
                    ctx.closePath();
                    break;
                default:
                    ctx[args[0]].apply(ctx, args[1]);
                    break;
            }

        }

        
    }
}

Frame.prototype.setPos = function(x, y) {
    this.p_x = x || 0;
    this.p_y = y || 0;
};

Frame.prototype.setImage = function(img) {

}



var childs = [],
    context, ticks = [];
window.onload = function() {
    var canvas = document.getElementById("canvas"); // 先获取画布
    canvas.width = 800; // 将画布设置为800px宽
    canvas.height = 800; // 将画布设置为800px高
    context = canvas.getContext("2d"); // 获取画布的上下文环境，进行2d绘图
    // drawRadiusRect(context, 150, 150, 500, 500, 50); // 调用drawRadiusRect()函数

    window.requestAnimationFrame(animate);

    var f = new Frame(context);
    childs.push(f);

    f.drawPath('fillRect', [20, 20, 200, 200], {
        fillStyle: "green"
    });

    f.drawPath('lineTo', [200, 200], {
        fillStyle: "#000",
        lineWidth: 4
    });

    // f.drawPath('fillRect', [200, 200, 200, 200], { fillStyle: "green" });

    ticks.push(() => {
        f.setPos(++f.p_x, ++f.p_y);
    });
}

function animate() {
    context.clearRect(0, 0, 800, 800);
    childs.forEach(v => v.update());
    ticks.forEach(v => v());
    window.requestAnimationFrame(animate);
}