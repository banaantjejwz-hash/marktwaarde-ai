import { redirect } from 'next/navigation';

// Belt + suspenders: next.config.ts handles the Vercel edge redirect,
// and this server-side redirect is the fallback.
export default function RootPage() {
  redirect('/marktwaarde');
}
