import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
// Notion Secret keys have been set up at env 

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    const encoded = Buffer.from(
        `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_API_SECRET}`
    ).toString('base64');
    if (code) {
        const response = await axios('https://api.notion.com/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Basic ${encoded}`,
                'Notion-Version': '2022-06-28',
            },
            data: JSON.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.NOTION_REDIRECT_URI!,
            }),
        });
        if (response) {
            const notion = new Client({
                auth: response.data.access_token,
            });
            const searchResults = await notion.search({
                filter: {
                    value: 'page', // not 'database'
                    property: 'object',
                },
                sort: {
                    direction: 'ascending',
                    timestamp: 'last_edited_time',
                },
            });

            // Find the first database page
            const databasePage = searchResults.results.find(
                (r: any) => r.object === 'page' && r.parent?.type === 'database_id'
            );
            const databaseId = databasePage?.id ?? '';

            console.log(databaseId)

            return NextResponse.redirect(
                `https://localhost:3000/connections?access_token=${response.data.access_token}&workspace_name=${response.data.workspace_name}&workspace_icon=${response.data.workspace_icon}&workspace_id=${response.data.workspace_id}&database_id=${databaseId}`
            );
        }
    }

    return NextResponse.redirect('https://localhost:3000/connections');
}