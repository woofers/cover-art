import { cva, cx } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

function clsx(...inputs: Parameters<typeof cx>) {
  return twMerge(cx(inputs))
}

export { cva, clsx }

export type {
  VariantProps,
  CxOptions,
  CxReturn
} from 'class-variance-authority'
