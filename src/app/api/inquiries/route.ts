import 'server-only'
import { createInquiryHandler } from '@/lib/inquiry'
import { inquiryMailConfig, sendInquiry } from '@/lib/inquiry-mail'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const handle = createInquiryHandler({ configured: () => Boolean(inquiryMailConfig()), send: sendInquiry })
export const GET = handle
export const POST = handle
