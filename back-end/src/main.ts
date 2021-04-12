type OutputType = {
  [key: string]: string[]
}

export const evaluate = async (_filename: string): Promise<OutputType> => {
  return {
    foo: ['bar', 'baz'],
  }
}
