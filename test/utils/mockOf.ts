type AnyFunction = (...args: any[]) => any // eslint-disable-line @typescript-eslint/no-explicit-any

export type MockOf<T> = T extends AnyFunction
  ? jest.Mock<ReturnType<T>, Parameters<T>>
  : {
      [K in keyof T]: T[K] extends AnyFunction
        ? jest.Mock<ReturnType<T[K]>, Parameters<T[K]>>
        : T[K]
    }

function mockOf<T extends object>(object: T): MockOf<T>
function mockOf<T extends AnyFunction>(fn: T): MockOf<T>
function mockOf<T extends object>(object: T): MockOf<T> {
  return (object as unknown) as MockOf<T>
}

export default mockOf
