export default <T>(array: T[], groupsize: number): T[][] => {
  let sets = [],
    chunks,
    i = 0
  chunks = array.length / groupsize

  while (i < chunks) {
    sets[i] = array.splice(0, groupsize)
    i++
  }

  return sets
}
