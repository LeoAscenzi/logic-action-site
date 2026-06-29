import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PHONE_E164, EMAIL } from "@/app/lib/site";

// Organization + WebSite structured data (schema.org).
// Helps Google understand the brand entity and improves rich-result eligibility.
// When social profiles exist, add their URLs to `sameAs`.
export default function JsonLd() {
	const graph = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "EducationalOrganization",
				"@id": `${SITE_URL}/#organization`,
				name: SITE_NAME,
				url: SITE_URL,
				logo: `${SITE_URL}/logo-light-main.png`,
				image: `${SITE_URL}/opengraph-image`,
				description: SITE_DESCRIPTION,
				telephone: PHONE_E164,
				email: EMAIL,
				areaServed: "New York City",
				address: {
					"@type": "PostalAddress",
					addressLocality: "New York",
					addressRegion: "NY",
					addressCountry: "US",
				},
				sameAs: [],
			},
			{
				"@type": "WebSite",
				"@id": `${SITE_URL}/#website`,
				name: SITE_NAME,
				url: SITE_URL,
				publisher: { "@id": `${SITE_URL}/#organization` },
			},
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
		/>
	);
}
