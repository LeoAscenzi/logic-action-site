export type faqType = {
    question: string,
    answer: string,
}

// Just doing this for now until we have a CMS
export async function getFAQs(locale: string){
  switch (locale) {
    case "zh":
      return (await import("@/data/faq/zh")).faqData as faqType[]
    case "en":
    default:
      return (await import("@/data/faq/en")).faqData as faqType[]
  }
}