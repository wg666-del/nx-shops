// 我们在开发中经常遇到长列表渲染问题，如果列表项非常多，例如上千条数据，一次性渲染所有节点会导致页面卡顿、滚动不流畅、内存占用高等问题。
// 虚拟列表就是针对此类问题而出现的一种性能优化技术，它只渲染可视区域内的列表项，而非整个列表，从而大大减少列表DOM节点数量，提升性能。

// 实现步骤：
// 1、计算可见区域：首先需要知道滚动容器（通常是父元素）的高度
// 2、计算可见区域内的列表项：根据滚动位置，计算出哪些列表项应该出现在可视区域内
// 3、假设每个列表项的高度为 itemSize , 列表总数据为 listData , 则列表总高度为 itemSize * listData.length
// 4、监听滚动事件，获取scrollTop值，计算可视区域内的起始索引和结束索引
//      可视区域内可显示的项数：visibleCount = Math.ceil(滚动容器高度 / itemSize) + 缓冲项数(为了滚动时不留白，可以提前多渲染一些项)
//      起始索引：startIndex = Math.floor(scrollTop / itemSize)
//      结束索引：startIndex + visibleCount
// 5、列表容器设置position: relative，可视区域渲染的列表项设置position: absolute相对于列表容器定位

// 适用场景：
// 1、大型数据表格，成千上万条数据
// 2、日志列表，大量日志条目
// 3、网站商品列表

// 虚拟滚动 VS 分页加载
// 1、虚拟滚动：保持连续性体验，适合顺序浏览场景；无需等待分页加载的接口请求延迟
// 2、分页加载：数据分段，可以导航到特定位置，适合精确查找场景

// 进一步优化的点：
// 1、当列表项高度不固定时，虚拟滚动会遇到什么挑战？有哪些解决方案？
// 2、虚拟滚动在快速滚动时可能会出现白屏，如何优化？如果用户在快速滚动后突然停止，如何保证立即显示正确内容？

// 相关的库：react-virtualized、ahooks中的useVirtualList

// 总结：虚拟列表的核心思想是按需渲染，通过只渲染可视区域内的节点来大幅提升性能

import React, { useState, useEffect, useRef, useMemo } from 'react';

const VirtialList = ({ data, itemHeight, containerHeight }) => {
  const [scrollTop, setScrollTop] = useState(0);

  const containerRef = useRef(null);

  // 可见区域的项数
  const visibleCount = useMemo(
    () => Math.ceil(containerHeight / itemHeight),
    [containerHeight, itemHeight]
  );

  // 开始索引
  const startIndex = useMemo(
    () => Math.floor(scrollTop / itemHeight),
    [scrollTop, itemHeight]
  );

  // 结束索引
  const endIndex = useMemo(
    () => startIndex + visibleCount,
    [startIndex, visibleCount]
  );

  // 渲染的列表项
  const visibleData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  // 总高度
  const totalHeight = useMemo(
    () => data.length * itemHeight,
    [data, itemHeight]
  );

  // 处理滚动
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #cccccc',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* 只渲染可见的列表项 */}
        {visibleData.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: '100%',
                borderBottom: '1px solid #eeeeee',
                boxSizing: 'border-box',
              }}
            >
              数据项{actualIndex + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 使用
const App = () => {
  const data = new Array(10000).fill({}).map(() => ({}));
  return <VirtialList data={data} itemHeight={30} containerHeight={500} />;
};
