import 'server-only'
import { Client } from '@notionhq/client'

// Notion API v5 works with "data sources" (the tables inside a database).
// We store the data source id in Notion.databaseId / Workflows.notionDbId.

export const findFirstNotionDataSource = async (accessToken: string) => {
  const notion = new Client({ auth: accessToken })
  const results = await notion.search({
    filter: { property: 'object', value: 'data_source' },
    sort: { direction: 'descending', timestamp: 'last_edited_time' },
    page_size: 1,
  })
  return results.results[0]?.id ?? ''
}

const getTitlePropertyName = async (notion: Client, dataSourceId: string) => {
  const dataSource: any = await notion.dataSources.retrieve({
    data_source_id: dataSourceId,
  })
  const entry = Object.entries(dataSource.properties ?? {}).find(
    ([, prop]: [string, any]) => prop?.type === 'title'
  )
  return entry?.[0] ?? 'Name'
}

// Accepts either plain text or the JSON object the editor stores ({ name, kind, type }).
const toPageTitle = (content: unknown) => {
  if (typeof content === 'string') {
    try {
      return toPageTitle(JSON.parse(content))
    } catch {
      return content
    }
  }
  if (content && typeof content === 'object') {
    const obj = content as Record<string, unknown>
    return String(obj.name || obj.title || JSON.stringify(obj))
  }
  return String(content ?? '')
}

export const createNotionPage = async (
  dataSourceId: string,
  accessToken: string,
  content: unknown
) => {
  if (!dataSourceId) throw new Error('No Notion database selected')
  const notion = new Client({ auth: accessToken })
  const titleProperty = await getTitlePropertyName(notion, dataSourceId)
  const title = toPageTitle(content).slice(0, 2000) || 'New entry from Articulo'

  return notion.pages.create({
    parent: { type: 'data_source_id', data_source_id: dataSourceId },
    properties: {
      [titleProperty]: { title: [{ text: { content: title } }] },
    },
  })
}
