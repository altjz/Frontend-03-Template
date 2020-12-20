# 第20周学习笔记

## 作业说明

### githooks(hooks + eslint)

- npm install
- npm run pre-commit

由于 hooks 脚本是无法上传的，所以这里借用了 husky 来完成上传的 hooks 执行，`pre-commit` 执行了 eslitn 的代码校验

### headless

- npm install
- npm run start
- npm run test

puppeteer 借用了 mocha 来完成测试，图片是否有加载成功

## Git Hooks

Git Hooks 可以用于一些 Git 的提交做一些操作，这样可以防止开发者提交之前做一些比较傻的操作

前端一般用 `husky` 做 git hooks 检查，不过`husky` 之所以叫哈士奇，是因为二哈很爱捣蛋？？？

`pre-commit` 有时候会和实际检查的不一样，像老师的例子是自动帮用户使用 `git stash push -k` 加上 `git stash pop` 来完成这部分问题

但实际上会导致使用上引发冲突的问题，有另外一个方法，就是检查用户当前的 `git status` 如果还有没有提交的文件，则拒绝用户的提交，强制要求当前没有 unstaged 或者 untracked 的文件，不过由于 git 并没有提供比较方便的指令排查，所以也只能自己解析 `git status` 的内容做分析了

## ESLint

ESLint 已经成为前端必备的代码检查，因为用的非常多，这里讲的也比较简单，没什么好说。

不过我一直比较疑惑 `prettier` 和 `eslint` 之间的关系，因为 `eslint` 也有代码风格的检查，一直没用过 `prettier`，不知道他们之间的区分

## Headless

有接触过一些项目使用 `Headless` 来检查一些基本问题，例如页面是否白屏，页面跳转，路由是否正常，这个时候通常配合单元测试的工具，例如 mocha 或者 jest 做测试，这种测试一般和单元测试分开的，叫 `E2E` 测试，(End to End)，就是端到端的测试

不过研究了一下，还有很多很有意思的功能。例如，html 转 pdf 或者 图片，甚至配合爬虫工具，可以做很多很有意思的活。
