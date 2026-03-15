import contentData from "../test-website/content.json"
import metadataData from "../test-website/metadata.json"
import stylesData from "../test-website/styles.json"

export const content = contentData
export const metadata = metadataData
export const styles = stylesData

export type ContentType = typeof contentData
export type MetadataType = typeof metadataData
export type StylesType = typeof stylesData
