import { PrintJob } from 'printer'
import fakePrinter from './fakePrinter'

test('builds a Printer with default values', () => {
  const printer = fakePrinter()

  expect(typeof printer.name).toBe('string')
  expect(printer.isDefault).toBe(true)
  expect(printer.options).toBeInstanceOf(Object)
  expect(printer.jobs).toBeInstanceOf(Array)
})

test('can override `name`', () => {
  expect(fakePrinter({ name: 'print-thing' }).name).toBe('print-thing')
})

test('can override `isDefault`', () => {
  expect(fakePrinter({ isDefault: false }).isDefault).toBe(false)
})

test('can override `options`', () => {
  expect(fakePrinter({ options: { copies: '1' } }).options).toEqual({
    copies: '1',
  })
})

test('can override `jobs`', () => {
  expect(
    fakePrinter({ jobs: [({ id: 'abc123' } as unknown) as PrintJob] }).jobs
  ).toEqual([{ id: 'abc123' }])
})
