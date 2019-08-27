type AnyFunction = (...args: any[]) => any // eslint-disable-line @typescript-eslint/no-explicit-any

export type MockNamespaceOf<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? jest.Mock<ReturnType<T[K]>, Parameters<T[K]>>
    : T[K]
} &
  Pick<jest.Mock, 'mockReset'>

export type MockFunctionOf<T extends AnyFunction> = jest.Mock<
  ReturnType<T>,
  Parameters<T>
>

export type MockOf<T> = T extends AnyFunction
  ? MockFunctionOf<T>
  : MockNamespaceOf<T>

export function mockNamespace<T extends object>(object: T): MockNamespaceOf<T> {
  const mock = object as MockNamespaceOf<T>

  return {
    ...mock,
    mockReset(): void {
      Object.getOwnPropertyNames(mock).forEach(key => {
        const value = mock[key as keyof T | 'mockReset']

        if (value && (value as jest.Mock).mockReset) {
          ;(value as jest.Mock).mockReset()
        }
      })
    },
  }
}

function mockOf<T extends AnyFunction>(fn: T): MockFunctionOf<T>
function mockOf<T extends object>(object: T): MockNamespaceOf<T>
function mockOf<T extends object>(object: T): MockOf<T> {
  const mock = (object as unknown) as MockOf<T>

  if (typeof object === 'function') {
    return mock
  }

  return (mockNamespace(object) as unknown) as MockOf<T>
}

export default mockOf
