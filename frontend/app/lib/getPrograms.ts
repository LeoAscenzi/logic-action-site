export type Program = {
    title: string,
    description: string,
    facts: string[],
    stats: {label: string; value: string;}[]

}

// Just doing this for now until we have a CMS
export async function getPrograms(locale: string){
  switch (locale) {
    case "zh":
      return (await import("@/data/programs/zh")).programs as Program[]
    case "en":
    default:
      return (await import("@/data/programs/en")).programs as Program[]
  }
}