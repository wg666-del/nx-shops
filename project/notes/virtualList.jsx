// 我们在开发中经常遇到长列表渲染问题，如果列表项非常多，例如上千条数据，一次性渲染所有节点会导致页面卡顿、滚动不流畅等问题。
// 虚拟列表就是针对此类问题而出现的一种性能优化技术，它只渲染可视区域内的列表项，而非整个列表，从而大大减少列表DOM节点数量，提升性能。

// 实现步骤：
// 1、计算可见区域：首先需要知道滚动容器（通常是父元素）的高度
// 2、计算可见区域内的列表项：根据滚动位置，计算出哪些列表项应该出现在可视区域内
// 3、假设每个列表项的高度为 itemSize , 列表总数居为 listData , 则列表总高度为 itemSize * listData.length
// 4、监听滚动事件，获取scrollTop值，计算可视区域内的起始索引和结束索引
//      可视区域内可显示的项数：visibleCount = Math.ceil(滚动容器高度 / itemSize) + 缓冲项数(为了滚动时不留白，可以提前多渲染一些项)
//      起始索引：startIndex = Math.floor(scrollTop / itemSize)
//      结束索引：startIndex + visibleCount
// 5、列表容器设置position: relative，可视区域渲染的列表项设置position: absolute相对于列表容器定位

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
