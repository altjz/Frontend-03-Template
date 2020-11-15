# 学习笔记

## 手势的基本知识

手势和普通的鼠标点击非常的不一样

1. Start -> Tap
2. Start -> Press Start -> Press End 一般用 0.5 秒作为按压的阈值
3. Start -> Pan Start -> Move -> Pan -> Pan End
4. Start -> Pan Start -> Move -> Pan 速度 大于一定值 -> Flick

鼠标不需要通过监听 mousedown 事件才触发 mousemove

可以直接使用 touchstart 和 touchmove

## 手势的多点触控以及鼠标的按键

手势是可以多点触控的，鼠标也不止一个按键

多点触控的是可以 `event.identifier` 和 鼠标可以以 `event.button` 来判定是哪个触点或者是哪个按键

但非常不一样的是，鼠标是不需要按下才能触发`move`，因此 鼠标还需要使用一个值 `event.buttons` 来检测目前哪些鼠标按键被按下

`event.buttons` 是用了一种非常古老的表达式，掩码（现在经常发现在一些单片机里面发现这种）

- 0  : 没有按键或者是没有初始化
- 1  : 鼠标左键
- 2  : 鼠标右键
- 4  : 鼠标滚轮或者是中键
- 8  : 第四按键 (通常是“浏览器后退”按键)
- 16 : 第五按键 (通常是“浏览器前进”)

## Filck 手势

Filck 手势是通过计算速度测量出来

Winter 老师定了 1.5 作为阈值，但我测试了我的鼠标其实很难触发 1.5 值，或者说是不是鼠标不太需要 Flick 这个手势呢
