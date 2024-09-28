import React from 'react'
import { suspend } from 'suspend-react'

const delayMessage = async (delay: number) => {
  await new Promise(r => setTimeout(r, delay))
  console.log(delay)
  const resp = await fetch('https://api.sampleapis.com/beers/ale');
  const json = await resp.json();
  return json[Math.floor(delay / 1000)] as {}
}

const Delay: React.FC<{ delay: number }> = ({ delay = 1000 }) => {
  const value = suspend(() => delayMessage(delay), [delay])
  return <div>{value.name} - {value.price}</div>
}

export default Delay
