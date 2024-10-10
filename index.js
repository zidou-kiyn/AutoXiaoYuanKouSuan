// 启动小猿口算应用
launchApp("小猿口算");
// 显示控制台
console.show();


// 定义一个函数，用于检测是否出现{}/{}题的控件
function waitForQuestionCount() {
    while (true) {
        // 查找包含题目数量的控件，className为android.widget.TextView
        let elements = className("android.widget.TextView").find();
        for (let i = 0; i < elements.length; i++) {
            let text = elements[i].text();
            // 检测文本是否匹配格式，如 "5/10题"
            if (/^\d{1,2}\/\d{1,2}题$/.test(text)) {
                console.log("找到题目控件: " + text);
                return text;  // 找到后退出循环
            }
        }
        sleep(500);  // 每隔0.5秒钟检测一次
    }
}

function waitForQuestion() {
    while (true) {
        // 查找包含题目数量的控件，className为android.widget.TextView
        let elements = className("android.widget.TextView").find();
        for (let i = 0; i < elements.length; i++) {
            let text = elements[i].text();
            text = text.replace(/\u00A0/g, '');  // 替换掉不可见字符
            if (/^\d+\s*[+-]\s*\d+\s*=$/.test(text)) {
                console.log("找到等式: " + text);
                return elements[i];  // 找到后退出循环
            }
        }
        sleep(500);  // 每隔0.5秒钟检测一次
    }
}

var digits = {
    '0': [ [20,20], [80,20], [80,140], [20,140], [20,20] ],
    '1': [ [80,20], [80,140]],
    '2': [ [20,20], [80,20], [20,140], [80,140]],
    '3': [ [20,20], [80,20],  [20,80], [80,80], [20,140]],
    '4': [ [20,20], [20,80], [80,80],[50,50], [50,140]],
    '5': [ [80,20], [20,20], [80,140], [20,140] ],
    '6': [ [80,20], [20,140], [80,140], [50,80]],
    '7': [ [20,20], [80,20], [50,140] ],
    '8': [ [20,20], [80,140], [20,140], [80,20], [20,20]],
     '9': [ [80,140], [80,20], [20,50], [80,80]]
};
// 获取设备屏幕宽高
var width = device.width;
var height = device.height;

function writeNumbers(numbers) {
    var digitWidth = 230;
    var digitHeight = 230;
    var digitSpacing = 80; // 设置数字之间的间距

    // 计算总宽度，包括所有数字和间距
    var totalWidth = numbers.length * digitWidth + (numbers.length - 1) * digitSpacing;
    var startX = width / 2 - totalWidth / 2;
    var startY = height - digitHeight - 700;

    for (var i = 0; i < numbers.length; i++) {
        var num = numbers.charAt(i);
        var strokes = digits[num];
        // 计算当前数字的 x 偏移量，考虑间距
        var xOffset = startX + i * (digitWidth + digitSpacing);
        var yOffset = startY;

        for (var j = 0; j < strokes.length - 1; j++) {
            var x1 = strokes[j][0] / 100 * digitWidth + xOffset;
            var y1 = strokes[j][1] / 100 * digitHeight + yOffset;
            var x2 = strokes[j + 1][0] / 100 * digitWidth + xOffset;
            var y2 = strokes[j + 1][1] / 100 * digitHeight + yOffset;

            swipe(x1, y1, x2, y2, 10); // 持续时间可根据需要调整
        }
        sleep(10); // 可选的短暂休眠
    }
}  


// 等待题目控件出现
waitForQuestionCount();

// writeNumbers("90");


while (true) {
    // 查找包含等式的控件
    let text = waitForQuestionCount();
  	
    let equationElement = waitForQuestion();

    let equationText = equationElement.text().replace(/\s/g, ''); // 移除多余的空白字符

    // 分析等式，计算结果
    let result = eval(equationText.slice(0, -1)); // 去掉 "=" 并计算结果
  
    console.log("计算结果: " + result);
  
    writeNumbers(String(result));
  
    if (/^(\d{1,2})\/\1题$/.test(text)) {
        break;  // 完成10题后退出循环
    }
  
    sleep(800);  // 等待一段时间，模拟用户答题时间
}

console.log("答题结束");
sleep(2000);
console.hide();