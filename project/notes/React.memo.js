React.memo = function (Component, compareFunc) {
  return function memoizedComponent(props) {
    const memoPropsRef = React.useRef({})
    const memoComponentRef = React.useRef(Component(memoPropsRef.current))
    const shouldRender = !!compareFunc()
    if (shouldRender) {
      return Component(props)
    }
    return memoComponentRef.current
  };
}