export default (props, { emit }) => {
  const clickHead = (e) => {
    emit('clickHead', e.target.getAttribute('value'))
  }

  return (
    <div className='labels-head' onClick={clickHead}>
      {
        props.headList && props.headList.map((item, index) => {
          return (
            <span key={`head${index}`}
              style={{width: `${100 / props.headList.length}%`}}
              class={item.source == props.modelValue && 'select'}
              value={item.source}>
              {item.divide}
            </span>
          )
        })
      }
    </div>
  )
}
