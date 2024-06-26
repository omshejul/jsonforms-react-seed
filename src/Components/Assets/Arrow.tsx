const Arrow = () => {
  return (
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translate(-100%, -50%)',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="#1976D2" height="24" viewBox="0 -960 960 960" width="24">
        <path d="m560-120-57-57 144-143H200v-480h80v400h367L503-544l56-57 241 241-240 240Z"/>
      </svg>
    </span>
  )
}

export default Arrow;
