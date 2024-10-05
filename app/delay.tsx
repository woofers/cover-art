import React, { use } from 'react'

const delayMessage = async (delay: number) => {
  await new Promise(r => setTimeout(r, delay))
  return { name: delay } as unknown as { name: string; price: string }
}

const Delay: React.FC<{ delay: number }> = ({ delay = 1000 }) => {
  const value = use(delayMessage(delay))
  return (
    <div>
      {value.name} - {value.price}
    </div>
  )
}

export default Delay
