# 第二周 学习笔记

## 状态机 和 KMP

其实本周重点内容是浏览器协议解析，但是我基本没什么兴趣。

完全被 KMP 和 状态机 给吸引住了，花了很多时间在这个上面，不知道是不是有点浪费时间。

### PMT

一开始写了一个 朴素算法，实现字符串，直到看到有 KMP 之后，立马就尝试了 KMP，花了大概几天实践，使用 PMT 的话基本上理解了，也写了自己对 KMP (PMT) 的理解心得。

但是 Winter 老师的要求是用状态机，搜索了一下，才知道 KMP 是有两种解法，虽然说核心思想差不多，都是通过空间，达到指针不回溯，但是状态机的解法（目前比较出名的是，算法导论里面 DFA）但我到目前为止，我还是没有理解，这个算法。

所以我没有把 DFA 的解题填上去。

### 状态机

我根据 Winter 老师前面的 状态机的实践，和我自己的对 KMP 的理解，自己写了一个。其实是 PMT 加 状态机，有点不伦不类。

我这个实现有点问题，只能返回 布尔，无法返回 序号（有尝试过，但是失败了），因此，我也没法去 leetcode 把 strStr() 测试一下。

然后我觉得，想要彻底理解 DFA 的解法，我可能需要彻底理解 状态机，现在只是简单的对 Winter 老师写过的进行模仿。

感觉它是一个非常强大的设计模式，但是理解起来有点抽象。

### indexOf

这里算是在了解 KMP 算法之前，我自己的一个想法，因为首先想到了用 indexOf。

当看到要匹配字符串的时候，我很自然的想到了两层嵌套循环（朴素算法）去实现，其实心里面是知道这个算法肯定是效率很差的，O(n*m)。

后面老师提到了 KMP 算法，就去了解了一下，挺复杂的，花了好几天才理解它的用意，设计特别巧妙。

但是反过来我就有一个疑问了，javascript 里面的 indexOf，其实也能匹配字符串，它是使用 KMP 的吗？

然后使用追溯法，决定深究一下 javascript indexOf

然后找到了 V8 的源码：

[string-search](https://android.googlesource.com/platform/external/v8/+/77008027c3252aa4e9d5f03f66c42e435bd69aee/src/string-search.h)

```c++

  static int SingleCharSearch(StringSearch<PatternChar, SubjectChar>* search,
                              Vector<const SubjectChar> subject,
                              int start_index);
  static int LinearSearch(StringSearch<PatternChar, SubjectChar>* search,
                          Vector<const SubjectChar> subject,
                          int start_index);
  static int InitialSearch(StringSearch<PatternChar, SubjectChar>* search,
                           Vector<const SubjectChar> subject,
                           int start_index);
  static int BoyerMooreHorspoolSearch(
      StringSearch<PatternChar, SubjectChar>* search,
      Vector<const SubjectChar> subject,
      int start_index);
  static int BoyerMooreSearch(StringSearch<PatternChar, SubjectChar>* search,
                              Vector<const SubjectChar> subject,
                              int start_index);
```

原来 V8 里面是定义了，5种类型的字符串搜索。会根据 字符串的长度来匹配要用那种。

- 如果 pattern 只有一个长度，则使用 SingleCharSearch，直接一个循环搞定。
- 两个的话，会先使用 LinearSearch (就是朴素穷举法)，当到了 `int badness = -10 - (pattern_length << 2);` badness 大于 0 的时候，会自动切换 BM 算法。

有点意思，所以也并没有用到 KMP，查了一下，BM 算是 KMP 的改良，还有一个 BMH ，我也不知道啥意思，估计是 BM 优化版。

然后立下一个 Flag，有空再研究一下 BM（状态机和 KMP 我还没搞定 😂）。

### 本周作业

由于一直被 KMP，状态机吸引，导致本来学习的重点。浏览器协议解析，基本没怎么研究，作业也是拖到 最后一个小时才完成。

下次决定先把作业做完，再来看这些 🤣
