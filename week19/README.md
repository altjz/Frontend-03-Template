# 第19周学习笔记

## 作业说明

**需要提供 CLIENT_ID 和 CLIENT_SECRETS 两个环境变量**

### Server

1. npm install
2. npm start

### Publish

1. npm install
2. npm start

## 本周总结

本周学习了发布系统的一套逻辑，提供了一个不错的思路，由于公司都是使用 `jenkins` 发版，我们构建和打包都是在服务器上操作的，但是经常需要输入一些参数，或者要做一些前置操作，`jenkins` 虽然可以定制，但是要使用 `Groovy` 来写，这对于前端人员来说，有点蛋疼。

由于 `jenkins` 都有很详细 webhook api，通过该章节的发布系统，我想到了可以添加一个中间的使用 node.js 发版系统，这样整个开发流程和发布流程都比较流畅，前端人员也不需要再学习蛋疼的 `Groovy` 语法
