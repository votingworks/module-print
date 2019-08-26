import { Printer } from 'printer'

export default function fakePrinter({
  name = 'my-printer',
  isDefault = true,
  options = {},
  jobs = [],
}: Partial<Printer> = {}): Printer {
  return {
    name,
    isDefault,
    options,
    jobs,
  }
}
