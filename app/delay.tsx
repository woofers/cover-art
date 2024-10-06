import React, { use } from 'react'

const delayMessage = async (delay: number) => {
  await new Promise(r => setTimeout(r, delay))
  return `Loaded after ${delay}ms`
}

const Delay: React.FC<{ delay: number }> = ({ delay = 1000 }) => {
  const value = use(delayMessage(delay))
  return <div>{value}</div>
}

export default Delay
