export type CourseCardType = {
    title: string,
    description: string,
}

// Just doing this for now until we have a CMS
export async function getCourseCards(locale: string){
  switch (locale) {
    case "zh":
      return (await import("@/data/home/zh")).courseCards as CourseCardType[]
    case "en":
    default:
      return (await import("@/data/home/en")).courseCards as CourseCardType[]
  }
}