export type Reducer<T> = (input: T) => Promise<T>

export default async function reduceAsync<T>(
  input: T,
  reducers: Reducer<T>[]
): Promise<T> {
  return reducers.reduce<Promise<T>>(
    async (memo, reduce) => reduce(await memo),
    Promise.resolve(input)
  )
}
