// 启动小猿口算应用
launchApp("小猿口算");
// 显示控制台
console.show();


// 定义一个函数，用于检测是否出现{}/{}题的控件
function waitForQuestionCount() {
    while (true) {
        // 查找包含题目数量的控件，className为android.widget.TextView
        let elements = className("android.widget.TextView").find();
//       	console.log(elements.length);
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
    '0': [[85, 52], [73, 69], [72, 86], [80, 111], [98, 121], [118, 113], [127, 94], [123, 67], [110, 49], [88, 51]],
    '1': [[100, 74], [100, 103], [101, 121]],
    '2': [[69, 54], [90, 50], [116, 64], [114, 81], [93, 100], [73, 112], [117, 112]],
    '3': [[73, 53], [95, 51], [106, 67], [87, 78], [100, 81], [112, 91], [94, 114], [79, 118]],
    '4': [[85, 48], [65, 75], [55, 100], [86, 104], [126, 102], [128, 82], [108, 73], [90, 103], [88, 119], [86, 141]],
    '5': [[121, 61], [88, 64], [79, 93], [100, 89], [121, 92], [119, 121], [86, 126]],
    '6': [[106, 47], [87, 60], [77, 74], [69, 99], [81, 122], [113, 125], [124, 93], [100, 82]],
    '7': [[76, 51], [109, 55], [132, 54], [130, 74], [123, 94], [112, 134]],
    '8': [[90, 89], [104, 80], [108, 59], [88, 41], [73, 39], [62, 63], [76, 82], [98, 99], [103, 115], [87, 126], [67, 118], [60, 98], [74, 90], [89, 86]],
    '9': [[110, 50], [90, 40], [67, 60], [75, 76], [106, 68], [106, 85], [104, 107], [103, 130]]
};
// 获取设备屏幕宽高
var width = device.width;
var height = device.height;

function writeNumbers(numbers) {
    var digitWidth = 200;
    var digitHeight = 200;
    var digitSpacing = 130; // 设置数字之间的间距

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
//         sleep(10); // 可选的短暂休眠
    }
  	sleep(500); // 可选的短暂休眠
}  


// 等待题目控件出现
// waitForQuestionCount();

// writeNumbers("9");


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
  
    sleep(200);  // 等待一段时间，模拟用户答题时间
}

console.log("答题结束");
sleep(2000);
console.hide();