/**
 * Renders one or more JSON-LD blobs as <script type="application/ld+json">.
 * Server component — safe to drop into any layout or page.
 */

type JsonLd = Record<string, unknown>

interface JsonLdProps {
  /** A single object or an array of schema objects to emit. */
  data: JsonLd | JsonLd[]
  /** Optional id — handy when the same page emits multiple schemas. */
  id?: string
}

export function JsonLd({ data, id }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={id ? `${id}-${i}` : i}
          type="application/ld+json"
          // JSON.stringify is safe here — schema builders produce plain data,
          // no user input flows in.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
